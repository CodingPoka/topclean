// import { forwardRef } from "react";
// import { format } from "date-fns";

// // ── POS THERMAL RECEIPT — 80mm roll printer ───────────────────────────────────
// const ReceiptPrint = forwardRef(({ order }, ref) => {
//   if (!order) return null;

//   const createdAt = order.createdAt?.toDate
//     ? order.createdAt.toDate()
//     : new Date();

//   const divider = "────────────────────────────";
//   const dashed = "- - - - - - - - - - - - - -";

//   return (
//     <div
//       ref={ref}
//       style={{
//         width: "302px",
//         margin: "0 auto",
//         padding: "12px 10px 20px",
//         background: "#fff",
//         color: "#000",
//         fontFamily: "'Courier New', Courier, monospace",
//         fontSize: "12px",
//         lineHeight: "1.5",
//       }}
//     >
//       {/* Logo */}
//       <div style={{ textAlign: "center", marginBottom: "6px" }}>
//         <img
//           src="/logot.png"
//           alt="Top Clean"
//           style={{ width: "80px", display: "inline-block" }}
//         />
//       </div>

//       {/* Shop name */}
//       <div
//         style={{
//           textAlign: "center",
//           fontWeight: "bold",
//           fontSize: "15px",
//           letterSpacing: "1px",
//         }}
//       >
        
//       </div>
//       <div style={{ textAlign: "center", fontSize: "10px", color: "#444" }}>
//         Luxury Laundry Services
//       </div>
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "10px",
//           color: "#666",
//           marginBottom: "8px",
//         }}
//       >
//         5-Star Hotel Standard
//       </div>

//       <div style={{ textAlign: "center", fontSize: "11px" }}>{divider}</div>

//       {/* Receipt meta */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginTop: "5px",
//           fontSize: "11px",
//         }}
//       >
//         <span>Receipt #:</span>
//         <span style={{ fontWeight: "bold" }}>{order.receiptNo}</span>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "11px",
//         }}
//       >
//         <span>Date:</span>
//         <span>{format(createdAt, "dd/MM/yyyy hh:mm a")}</span>
//       </div>

//       <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
//         {dashed}
//       </div>

//       {/* Customer */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "11px",
//         }}
//       >
//         <span>Name:</span>
//         <span
//           style={{ fontWeight: "bold", textAlign: "right", maxWidth: "60%" }}
//         >
//           {order.customerName}
//         </span>
//       </div>
//       {order.phone && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             fontSize: "11px",
//           }}
//         >
//           <span>Phone:</span>
//           <span>{order.phone}</span>
//         </div>
//       )}

//       <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
//         {dashed}
//       </div>

//       {/* Item header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "10px",
//           fontWeight: "bold",
//           marginBottom: "3px",
//         }}
//       >
//         <span style={{ flex: 1 }}>Item</span>
//         <span style={{ width: "22px", textAlign: "center" }}>Qty</span>
//         <span style={{ width: "46px", textAlign: "right" }}>Price</span>
//         <span style={{ width: "52px", textAlign: "right" }}>Total</span>
//       </div>
//       <div
//         style={{ textAlign: "center", fontSize: "11px", marginBottom: "4px" }}
//       >
//         {dashed}
//       </div>

//       {/* Items */}
//       {order.items?.map((item, i) => (
//         <div
//           key={i}
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             fontSize: "11px",
//             marginBottom: "3px",
//             alignItems: "flex-start",
//           }}
//         >
//           <span
//             style={{ flex: 1, paddingRight: "4px", wordBreak: "break-word" }}
//           >
//             {item.name}
//           </span>
//           <span style={{ width: "22px", textAlign: "center" }}>{item.qty}</span>
//           <span style={{ width: "46px", textAlign: "right" }}>
//             {item.price?.toLocaleString()}
//           </span>
//           <span
//             style={{ width: "52px", textAlign: "right", fontWeight: "bold" }}
//           >
//             {(item.price * item.qty)?.toLocaleString()}
//           </span>
//         </div>
//       ))}

//       <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
//         {dashed}
//       </div>

//       {/* Subtotal / tax */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "11px",
//         }}
//       >
//         <span>Subtotal</span>
//         <span>{order.total?.toLocaleString()}</span>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "11px",
//         }}
//       >
//         <span>Tax / VAT</span>
//         <span>0</span>
//       </div>

//       <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
//         {divider}
//       </div>

//       {/* Total */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "14px",
//           fontWeight: "bold",
//           marginBottom: "8px",
//         }}
//       >
//         <span>TOTAL</span>
//         <span>{order.total?.toLocaleString()}</span>
//       </div>

//       {/* Note */}
//       {order.note && (
//         <>
//           <div style={{ textAlign: "center", fontSize: "11px" }}>{dashed}</div>
//           <div style={{ fontSize: "10px", margin: "4px 0", color: "#444" }}>
//             Note: {order.note}
//           </div>
//         </>
//       )}

//       <div style={{ textAlign: "center", fontSize: "11px", margin: "5px 0" }}>
//         {dashed}
//       </div>

//       {/* Signature */}
//       <div style={{ fontSize: "10px", marginBottom: "10px" }}>
//         Authorized: ______________________
//       </div>

//       <div style={{ textAlign: "center", fontSize: "11px" }}>{divider}</div>

//       {/* Footer */}
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "11px",
//           marginTop: "6px",
//           fontStyle: "italic",
//         }}
//       >
//         Thank you for choosing Top Clean!
//       </div>
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "9px",
//           color: "#666",
//           marginTop: "3px",
//         }}
//       >
//         Please keep this receipt for your records.
//       </div>
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "10px",
//           fontWeight: "bold",
//           marginTop: "8px",
//           letterSpacing: "2px",
//         }}
//       >
//         * TOP CLEAN *
//       </div>
//     </div>
//   );
// });

// ReceiptPrint.displayName = "ReceiptPrint";
// export default ReceiptPrint;

// /*
//  * ─── OLD A4 PREMIUM RECEIPT (kept for future reference) ───────────────────────
//  * To restore the A4 version, delete everything above and uncomment this block.
//  *
//  * import { forwardRef } from "react";
//  * import { format } from "date-fns";
//  *
//  * const ReceiptPrint = forwardRef(({ order }, ref) => {
//  *   if (!order) return null;
//  *   const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
//  *   return (
//  *     <div ref={ref} className="bg-white text-gray-900 w-full max-w-2xl mx-auto font-sans"
//  *       style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
//  *
//  *       [Header navy bar, gold receipt bar, customer grid, items table,
//  *        gold total box, note section, navy footer with signature]
//  *
//  *     </div>
//  *   );
//  * });
//  * ReceiptPrint.displayName = "ReceiptPrint";
//  * export default ReceiptPrint;
//  * ─────────────────────────────────────────────────────────────────────────────
//  */

// // ── End of file ───────────────────────────────────────────────────────────────

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
            <strong>Name :</strong>{" "}
            {order.customerName?.slice(0, 18)}
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
            <strong>Date:</strong>{" "}
            {format(createdAt, "dd/MM/yyyy")}
          </span>
          <span style={{ textAlign: "right" }}>
            <strong>Phone :</strong>{" "}
            {order.phone || "-"}
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
          <span style={{ width: "22px", textAlign: "center" }}>
            {item.qty}
          </span>
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