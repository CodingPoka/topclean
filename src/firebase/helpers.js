import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./config";

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const createOrder = async (orderData) => {
  const ref = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: serverTimestamp(),
    status: "completed",
  });
  return ref.id;
};

export const getOrders = async () => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getOrdersByDateRange = async (startDate, endDate) => {
  const q = query(
    collection(db, "orders"),
    where("createdAt", ">=", Timestamp.fromDate(new Date(startDate))),
    where("createdAt", "<=", Timestamp.fromDate(new Date(endDate + "T23:59:59"))),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getOrdersByCustomer = async (customerName) => {
  const q = query(
    collection(db, "orders"),
    where("customerName", "==", customerName),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteOrder = async (id) => {
  await deleteDoc(doc(db, "orders", id));
};

export const getOrderById = async (id) => {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ─── INVOICES ───────────────────────────────────────────────────────────────

export const createInvoice = async (invoiceData) => {
  const ref = await addDoc(collection(db, "invoices"), {
    ...invoiceData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getInvoices = async () => {
  const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteInvoice = async (id) => {
  await deleteDoc(doc(db, "invoices", id));
};

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export const getServices = async () => {
  const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addService = async (serviceData) => {
  const ref = await addDoc(collection(db, "services"), {
    ...serviceData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateService = async (id, serviceData) => {
  await updateDoc(doc(db, "services", id), serviceData);
};

export const deleteService = async (id) => {
  await deleteDoc(doc(db, "services", id));
};

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const orders = await getOrders();

  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = orders.filter(
    (o) => o.createdAt?.toDate() >= todayStart
  );
  const monthOrders = orders.filter(
    (o) => o.createdAt?.toDate() >= monthStart
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const todaySales = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const monthSales = monthOrders.reduce((s, o) => s + (o.total || 0), 0);

  // Monthly revenue for last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const mOrders = orders.filter((o) => {
      const t = o.createdAt?.toDate();
      return t >= mStart && t <= mEnd;
    });
    monthlyData.push({
      month: d.toLocaleString("default", { month: "short" }),
      revenue: mOrders.reduce((s, o) => s + (o.total || 0), 0),
      orders: mOrders.length,
    });
  }

  // Service performance
  const serviceCount = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      serviceCount[item.name] = (serviceCount[item.name] || 0) + item.qty;
    });
  });
  const serviceData = Object.entries(serviceCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    monthOrders: monthOrders.length,
    totalRevenue,
    todaySales,
    monthSales,
    monthlyData,
    serviceData,
    recentOrders: orders.slice(0, 8),
  };
};

export const getDailyRecordsByMonth = async (monthKey) => {
  const now = new Date();
  const [year, month] = (monthKey || "").split("-").map(Number);

  const targetYear = Number.isInteger(year) ? year : now.getFullYear();
  const targetMonthIndex = Number.isInteger(month) ? month - 1 : now.getMonth();

  const monthStart = new Date(targetYear, targetMonthIndex, 1);
  const monthEnd = new Date(targetYear, targetMonthIndex + 1, 0, 23, 59, 59);

  const isCurrentMonth =
    targetYear === now.getFullYear() && targetMonthIndex === now.getMonth();
  const effectiveEnd = isCurrentMonth ? now : monthEnd;

  const startDate = monthStart.toISOString().split("T")[0];
  const endDate = effectiveEnd.toISOString().split("T")[0];
  const orders = await getOrdersByDateRange(startDate, endDate);

  const dailyMap = {};
  orders.forEach((order) => {
    const createdDate = order.createdAt?.toDate?.();
    if (!createdDate) return;

    const dayKey = `${createdDate.getFullYear()}-${String(
      createdDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(createdDate.getDate()).padStart(2, "0")}`;

    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = { orders: 0, sales: 0, date: createdDate };
    }

    dailyMap[dayKey].orders += 1;
    dailyMap[dayKey].sales += order.total || 0;
  });

  const allDays = [];
  const startOfWindow = new Date(targetYear, targetMonthIndex, 1, 0, 0, 0, 0);
  const endOfWindow = new Date(
    effectiveEnd.getFullYear(),
    effectiveEnd.getMonth(),
    effectiveEnd.getDate(),
    23,
    59,
    59,
    999,
  );

  const totalDaysInWindow = Math.floor(
    (endOfWindow.getTime() - startOfWindow.getTime()) / (1000 * 60 * 60 * 24),
  );

  for (let i = 0; i <= totalDaysInWindow; i++) {
    const d = new Date(targetYear, targetMonthIndex, 1 + i);
    if (d > effectiveEnd) break;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;
    const found = dailyMap[key];

    allDays.push({
      dateKey: key,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      axisLabel: d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      dateLabel: d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      orders: found?.orders || 0,
      sales: found?.sales || 0,
    });
  }

  return allDays;
};
