import { forwardRef } from "react";
import { format } from "date-fns";

// ── POS THERMAL RECEIPT — 80mm roll printer ───────────────────────────────────
const ReceiptPrint = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const createdAt = order.createdAt?.toDate
    ? order.createdAt.toDate()
    : new Date();

  const divider = "────────────────────────────";
  const dashed = "- - - - - - - - - - - - - -";

  return (
    <div
      ref={ref}
      style={{
        width: "302px",
        margin: "0 auto",
        padding: "12px 10px 20px",
        background: "#fff",
        color: "#000",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "12px",
        lineHeight: "1.5",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <img
          src="/logot.png"
          alt="Top Clean"
          style={{ width: "80px", display: "inline-block" }}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "17px",
          fontWeight: "700",
          letterSpacing: "0.8px",
          marginBottom: "2px",
        }}
      >
        Top Clean
      </div>

      <div style={{ textAlign: "center", fontSize: "10px", color: "#444" }}>
        Luxury Laundry Services
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          color: "#666",
          marginBottom: "8px",
        }}
      >
        5-Star Hotel Standard
      </div>

      <div style={{ textAlign: "center", fontSize: "11px" }}>{divider}</div>

      {/* ───── Receipt + Customer Side By Side ───── */}
      <div style={{ marginTop: "6px", fontSize: "11px" }}>
        {/* Row 1 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <strong>Receipt:</strong> {order.receiptNo}
          </span>
          <span style={{ textAlign: "right" }}>
            <strong>Name :</strong> {order.customerName?.slice(0, 18)}
          </span>
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <strong>Date:</strong> {format(createdAt, "dd/MM/yyyy")}
          </span>
          <span style={{ textAlign: "right" }}>
            <strong>Phone :</strong> {order.phone || "-"}
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: "11px", margin: "6px 0" }}>
        {dashed}
      </div>

      {/* Item header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          fontWeight: "bold",
          marginBottom: "3px",
        }}
      >
        <span style={{ flex: 1 }}>Item</span>
        <span style={{ width: "22px", textAlign: "center" }}>Qty</span>
        <span style={{ width: "46px", textAlign: "right" }}>Price</span>
        <span style={{ width: "52px", textAlign: "right" }}>Total</span>
      </div>

      <div
        style={{ textAlign: "center", fontSize: "11px", marginBottom: "4px" }}
      >
        {dashed}
      </div>

      {/* Items */}
      {order.items?.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            marginBottom: "3px",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{ flex: 1, paddingRight: "4px", wordBreak: "break-word" }}
          >
            {item.name}
          </span>
          <span style={{ width: "22px", textAlign: "center" }}>{item.qty}</span>
          <span style={{ width: "46px", textAlign: "right" }}>
            {item.price?.toLocaleString()}
          </span>
          <span
            style={{
              width: "52px",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {(item.price * item.qty)?.toLocaleString()}
          </span>
        </div>
      ))}

      <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
        {dashed}
      </div>

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <span>TOTAL</span>
        <span>{order.total?.toLocaleString()}</span>
      </div>

      <div style={{ textAlign: "center", fontSize: "11px", margin: "6px 0" }}>
        {divider}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          marginTop: "6px",
          fontStyle: "italic",
        }}
      >
        Thank you for choosing Top Clean!
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "9px",
          color: "#666",
          marginTop: "3px",
        }}
      >
        Please keep this receipt for your records.
      </div>
    </div>
  );
});

ReceiptPrint.displayName = "ReceiptPrint";
export default ReceiptPrint;
