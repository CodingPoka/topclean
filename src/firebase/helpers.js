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
