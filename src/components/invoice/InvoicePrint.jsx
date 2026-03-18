import { forwardRef } from "react";
import { format } from "date-fns";

const InvoicePrint = forwardRef(
  (
    { orders, dateFrom, dateTo, customerFilter, clientName, clientAddress },
    ref,
  ) => {
    if (!orders?.length) return null;

    // Aggregate all items across all orders by service name
    const itemMap = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.name;
        if (!itemMap[key]) {
          itemMap[key] = { name: item.name, qty: 0, rate: item.price || 0 };
        }
        itemMap[key].qty += item.qty || 1;
      });
    });
    const lineItems = Object.values(itemMap);
    const subtotal = lineItems.reduce((s, item) => s + item.qty * item.rate, 0);
    const tax = 0;
    const grandTotal = subtotal + tax;

    const billTo = clientName || customerFilter || "—";
    const billAddress = clientAddress || "";

    return (
      <div
        ref={ref}
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "794px",
          margin: "0 auto",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "13px",
          color: "#1a1a2e",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            background: "#ffffff",
            textAlign: "center",
            paddingTop: "32px",
            paddingBottom: "0",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          {/* Logo */}
          <img
            src="/logot.png"
            alt="Top Clean Logo"
            style={{
              width: "110px",
              height: "110px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 10px auto",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          {/* Company Name */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: "900",
              color: "#1a3a6b",
              letterSpacing: "2px",
              lineHeight: 1,
              marginBottom: "6px",
            }}
          >
            TOP CLEAN LAUNDRY
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#555",
              fontSize: "12px",
              letterSpacing: "1px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "50px",
                height: "1.5px",
                background: "#1a3a6b",
              }}
            />
            Professional Laundry Services
            <span
              style={{
                display: "inline-block",
                width: "50px",
                height: "1.5px",
                background: "#1a3a6b",
              }}
            />
          </div>

          {/* INVOICE ribbon banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
              marginBottom: "0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "150px",
                  height: "2px",
                  background: "#1a3a6b",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "9px",
                  height: "10px",
                  background: "#1a3a6b",
                  borderRadius: "2px",
                  marginRight: "8px",
                }}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #1a3a6b, #2563c7)",
                borderRadius: "9999px",
                padding: "10px 60px",
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "900",
                  fontSize: "20px",
                  letterSpacing: "6px",
                }}
              >
                INVOICE
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "9px",
                  height: "10px",
                  background: "#1a3a6b",
                  borderRadius: "2px",
                  marginLeft: "8px",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "150px",
                  height: "2px",
                  background: "#1a3a6b",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── INVOICE TO + SERVICE PERIOD ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            padding: "18px 32px",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          {/* Left: Invoice To */}
          <div style={{ paddingRight: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#e8f0fe",
                  border: "2px solid #1a3a6b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              >
                🧾
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#1a3a6b",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Invoice To:
              </span>
            </div>
            <div style={{ paddingLeft: "36px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1a1a2e",
                  marginBottom: "2px",
                }}
              >
                {billTo}
              </div>
              {billAddress && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#1a3a6b",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {billAddress}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: "#e5e7eb", width: "1px" }} />

          {/* Right: Service Period */}
          <div style={{ paddingLeft: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#e8f0fe",
                  border: "2px solid #1a3a6b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              >
                📅
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#1a3a6b",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Service Period:
              </span>
            </div>
            <div
              style={{
                paddingLeft: "36px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#1a1a2e",
              }}
            >
              {dateFrom ? format(new Date(dateFrom), "dd MMMM yyyy") : "—"}
              {" – "}
              {dateTo ? format(new Date(dateTo), "dd MMMM yyyy") : "—"}
            </div>
          </div>
        </div>

        {/* ── INVOICE DETAILS TABLE ── */}
        <div style={{ padding: "0 32px 16px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "11px 12px",
                    background: "#1a3a6b",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "center",
                    width: "48px",
                    borderRight: "1px solid #2a4a8b",
                  }}
                >
                  S/N
                </th>
                <th
                  style={{
                    padding: "11px 12px",
                    background: "#1a3a6b",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "left",
                    borderRight: "1px solid #2a4a8b",
                  }}
                >
                  Item Description
                </th>
                <th
                  style={{
                    padding: "11px 12px",
                    background: "#2a5298",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "center",
                    borderRight: "1px solid #3a62a8",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: "11px 12px",
                    background: "#2a5298",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "center",
                    borderRight: "1px solid #3a62a8",
                  }}
                >
                  Rate (SDG)
                </th>
                <th
                  style={{
                    padding: "11px 12px",
                    background: "#D4AF37",
                    color: "#1a1a2e",
                    fontSize: "12px",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Amount (SDG)
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => {
                const amount = item.qty * item.rate;
                return (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#ffffff" : "#dbeafe33",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#374151",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        fontWeight: "500",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "13px",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      {item.qty > 0 ? item.qty.toLocaleString() : "—"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#374151",
                        borderRight: "1px solid #e5e7eb",
                      }}
                    >
                      {item.rate > 0 ? item.rate.toLocaleString() : "—"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#1a1a2e",
                      }}
                    >
                      {amount > 0 ? amount.toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── TOTAL AMOUNT BANNER ── */}
        <div
          style={{
            margin: "0 32px 16px",
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(26,58,107,0.15)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #1a3a6b, #2563c7)",
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "15px",
                letterSpacing: "1px",
                whiteSpace: "nowrap",
              }}
            >
              TOTAL AMOUNT:
            </span>
          </div>
          <div
            style={{
              background: "linear-gradient(90deg, #D4AF37, #f0c930)",
              flex: 1,
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                color: "#1a1a2e",
                fontWeight: "900",
                fontSize: "26px",
                letterSpacing: "1px",
              }}
            >
              {grandTotal.toLocaleString()}
            </span>
            <span
              style={{
                color: "#1a1a2e",
                fontWeight: "700",
                fontSize: "16px",
                marginLeft: "6px",
              }}
            >
              SDG
            </span>
          </div>
        </div>

        {/* ── PAYMENT DETAILS + TOTALS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            padding: "0 32px 20px",
            alignItems: "start",
          }}
        >
          {/* Payment Details */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#e8f0fe",
                  border: "2px solid #1a3a6b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  flexShrink: 0,
                }}
              >
                💳
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#1a3a6b",
                }}
              >
                Payment Details
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#374151",
                lineHeight: "2.2",
                paddingLeft: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#1a3a6b",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                Payment Due:{" "}
                <strong style={{ marginLeft: "4px" }}>Upon Receipt</strong>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#1a3a6b",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                Payment Method:{" "}
                <span
                  style={{
                    display: "inline-block",
                    width: "100px",
                    borderBottom: "1px solid #9ca3af",
                    marginLeft: "4px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Totals */}
          <div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <tbody>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Subtotal:
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: "700",
                      textAlign: "right",
                      color: "#1a1a2e",
                    }}
                  >
                    {subtotal.toLocaleString()} SDG
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Tax (0%):
                  </td>
                  <td
                    style={{
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: "700",
                      textAlign: "right",
                      color: "#1a1a2e",
                    }}
                  >
                    0 SDG
                  </td>
                </tr>
                <tr style={{ background: "#1a3a6b" }}>
                  <td
                    style={{
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: "800",
                      color: "#D4AF37",
                    }}
                  >
                    Grand Total:
                  </td>
                  <td
                    style={{
                      padding: "10px 14px",
                      fontSize: "14px",
                      fontWeight: "900",
                      textAlign: "right",
                      color: "#ffffff",
                    }}
                  >
                    {grandTotal.toLocaleString()} SDG
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            position: "relative",
            background: "#ffffff",
            borderTop: "2px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {/* Blue wave decoration */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background:
                "linear-gradient(135deg, #1a3a6b 0%, #2563c7 50%, #1a3a6b 100%)",
              clipPath: "ellipse(110% 100% at 50% 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "16px 32px 64px",
            }}
          >
            {/* Thank you text */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                  color: "#374151",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "30px",
                    height: "1.5px",
                    background: "#9ca3af",
                  }}
                />
                Thank you for choosing{" "}
                <strong style={{ color: "#1a3a6b" }}>Top Clean Laundry!</strong>
                <span
                  style={{
                    display: "inline-block",
                    width: "30px",
                    height: "1.5px",
                    background: "#9ca3af",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#2563c7",
                  fontSize: "12px",
                  fontStyle: "italic",
                  fontWeight: "600",
                  paddingLeft: "8px",
                }}
              >
                <span style={{ color: "#1a3a6b", fontSize: "14px" }}>→</span>
                We appreciate your business!
                <span style={{ color: "#1a3a6b", fontSize: "14px" }}>←</span>
              </div>
            </div>

            {/* Laundry icons */}
            <div
              style={{
                fontSize: "28px",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}
            >
              🧺 🛁 👕 🫧
            </div>
          </div>
        </div>
      </div>
    );
  },
);

InvoicePrint.displayName = "InvoicePrint";
export default InvoicePrint;
