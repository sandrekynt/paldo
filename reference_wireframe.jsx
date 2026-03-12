import { useState } from "react";

const screens = {
login: "Login",
register: "Register",
onboarding: "Create Business",
businessSwitcher: "Business Switcher",
dashboard: "Dashboard",
inventoryList: "Inventory — Product List",
inventoryAdd: "Inventory — Add Product",
inventoryDetail: "Inventory — Product Detail",
inventoryRestock: "Inventory — Restock",
inventoryImport: "Inventory — Import",
posSelector: "POS — Product Selector",
posCart: "POS — Cart",
posPayment: "POS — Payment",
posReceipt: "POS — Receipt",
utangList: "Utang — Customer List",
utangDetail: "Utang — Customer Detail",
payrollEmployees: "Payroll — Employee List",
payrollRun: "Payroll — Run Payroll",
payrollPayslip: "Payroll — Payslip",
settings: "Settings",
};

const Box = ({ w = "100%", h = 16, rounded = 4, style = {} }) => (

  <div style={{ width: w, height: h, background: "#e8e8e8", borderRadius: rounded, flexShrink: 0, ...style }} />
);

const Line = ({ w = "100%", h = 1 }) => (

  <div style={{ width: w, height: h, background: "#e0e0e0", margin: "8px 0" }} />
);

const Label = ({ children, size = 11, weight = 400, color = "#999", style = {} }) => (

  <div style={{ fontSize: size, fontWeight: weight, color, fontFamily: "monospace", lineHeight: 1.4, ...style }}>{children}</div>
);

const Card = ({ children, style = {} }) => (

  <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 12, background: "#fff", ...style }}>
    {children}
  </div>
);

const Row = ({ children, gap = 8, align = "center", justify = "flex-start", style = {} }) => (

  <div style={{ display: "flex", flexDirection: "row", gap, alignItems: align, justifyContent: justify, ...style }}>
    {children}
  </div>
);

const Col = ({ children, gap = 8, style = {} }) => (

  <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
    {children}
  </div>
);

const Input = ({ label, w = "100%" }) => (

  <Col gap={4} style={{ width: w }}>
    {label && <Label size={10} color="#bbb">{label}</Label>}
    <div style={{ width: "100%", height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa" }} />
  </Col>
);

const Btn = ({ label = "Button", full = false, outline = false, small = false }) => (

  <div style={{
    height: small ? 30 : 38,
    padding: "0 16px",
    background: outline ? "#fff" : "#222",
    border: outline ? "1px solid #ccc" : "none",
    borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    width: full ? "100%" : "auto",
    flexShrink: 0,
  }}>
    <Label size={11} weight={500} color={outline ? "#555" : "#fff"}>{label}</Label>
  </div>
);

const Avatar = ({ size = 32 }) => (

  <div style={{ width: size, height: size, borderRadius: "50%", background: "#e0e0e0", flexShrink: 0 }} />
);

const Icon = ({ size = 18 }) => (

  <div style={{ width: size, height: size, borderRadius: 3, background: "#d8d8d8", flexShrink: 0 }} />
);

const Badge = ({ label, color = "#e8e8e8", textColor = "#888" }) => (

  <div style={{ padding: "2px 8px", background: color, borderRadius: 20, display: "inline-flex" }}>
    <Label size={10} color={textColor}>{label}</Label>
  </div>
);

const TopBar = ({ title, back = false, action }) => (

  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
    <Row gap={8}>
      {back && <div style={{ width: 20, height: 20, borderRadius: 4, background: "#e8e8e8" }} />}
      <Label size={14} weight={600} color="#222">{title}</Label>
    </Row>
    {action && <Btn label={action} small outline />}
  </div>
);

const BottomNav = ({ active }) => {
const items = ["Home", "Inventory", "POS", "Utang", "Payroll"];
return (
<div style={{ display: "flex", borderTop: "1px solid #efefef", padding: "8px 0 4px" }}>
{items.map(item => (
<div key={item} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
<Icon size={20} />
<Label size={9} color={active === item ? "#222" : "#bbb"} weight={active === item ? 600 : 400}>{item}</Label>
</div>
))}
</div>
);
};

const Phone = ({ children, title, noNav = false, active = "Home" }) => (

  <Col gap={0} style={{
    width: 320,
    minHeight: 580,
    border: "2px solid #222",
    borderRadius: 28,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    flexShrink: 0,
  }}>
    {/* Status bar */}
    <div style={{ background: "#fff", padding: "8px 20px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Label size={10} color="#222" weight={600}>9:41</Label>
      <Row gap={4}>
        <Box w={30} h={8} rounded={4} />
        <Box w={14} h={8} rounded={4} />
        <Box w={20} h={8} rounded={4} />
      </Row>
    </div>
    {title && <TopBar title={title} />}
    <div style={{ flex: 1, overflow: "hidden", padding: "0" }}>
      {children}
    </div>
    {!noNav && <BottomNav active={active} />}
  </Col>
);

// ─── SCREENS ──────────────────────────────────────────────────────────────────

const LoginScreen = () => (
<Phone noNav>
<Col gap={24} style={{ padding: 24, paddingTop: 40 }}>
<Col gap={4}>
<Box w={80} h={28} rounded={6} />
<Label size={12} color="#bbb">Sign in to your account</Label>
</Col>
<Col gap={12}>
<Input label="Email address" />
<Input label="Password" />
<Row justify="flex-end">
<Label size={10} color="#aaa">Forgot password?</Label>
</Row>
</Col>
<Btn label="Sign In" full />
<Line />
<Row justify="center">
<Label size={11} color="#bbb">Don't have an account? </Label>
<Label size={11} color="#555"> Register</Label>
</Row>
</Col>
</Phone>
);

const OnboardingScreen = () => (
<Phone noNav>
<Col gap={20} style={{ padding: 24, paddingTop: 32 }}>
<Col gap={4}>
<Label size={16} weight={700} color="#222">Set up your business</Label>
<Label size={12} color="#bbb">This takes less than 2 minutes</Label>
</Col>
<Col gap={12}>
<Input label="Business name" />
<Col gap={4}>
<Label size={10} color="#bbb">Business type</Label>
<div style={{ height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
<Label size={11} color="#ccc">Select type...</Label>
<Icon size={14} />
</div>
</Col>
<Col gap={4}>
<Label size={10} color="#bbb">Currency</Label>
<div style={{ height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
<Label size={11} color="#555">PHP — Philippine Peso</Label>
<Icon size={14} />
</div>
</Col>
<Col gap={4}>
<Label size={10} color="#bbb">Country</Label>
<div style={{ height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
<Label size={11} color="#555">Philippines</Label>
<Icon size={14} />
</div>
</Col>
</Col>
<div style={{ flex: 1 }} />
<Btn label="Create Business →" full />
</Col>
</Phone>
);

const BusinessSwitcherScreen = () => (
<Phone noNav>
<Col gap={20} style={{ padding: 24, paddingTop: 32 }}>
<Col gap={4}>
<Label size={16} weight={700} color="#222">Your Businesses</Label>
<Label size={12} color="#bbb">Select to continue</Label>
</Col>
<Col gap={8}>
{["Ate Marie's Sari-sari", "JM Construction Supply", "Bella's Boutique"].map((name, i) => (
<Card key={i} style={{ cursor: "pointer" }}>
<Row gap={12}>
<Box w={40} h={40} rounded={8} />
<Col gap={2} style={{ flex: 1 }}>
<Label size={13} weight={600} color="#222">{name}</Label>
<Label size={11} color="#bbb">Retail · PHP</Label>
</Col>
<Icon size={16} />
</Row>
</Card>
))}
</Col>
<Line />
<Row justify="center">
<Label size={11} color="#aaa">+ Add new business</Label>
</Row>
</Col>
</Phone>
);

const DashboardScreen = () => (
<Phone active="Home">
<Col gap={0} style={{ height: "100%", overflow: "auto" }}>
{/_ Header _/}
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Col gap={2}>
<Label size={12} color="#bbb">Good morning,</Label>
<Label size={15} weight={700} color="#222">Ate Marie's Sari-sari</Label>
</Col>
<Row gap={8}>
<Icon size={20} />
<Avatar size={32} />
</Row>
</Row>
</div>
<Col gap={12} style={{ padding: 16 }}>
{/_ Today's sales _/}
<Card style={{ background: "#f7f7f7" }}>
<Col gap={6}>
<Label size={10} color="#999">TODAY'S SALES</Label>
<Row align="flex-end" gap={8}>
<Box w={100} h={28} rounded={6} />
<Badge label="↑ 12% vs yesterday" />
</Row>
<Label size={10} color="#bbb">24 transactions</Label>
</Col>
</Card>
{/_ 3 metric cards _/}
<Row gap={8}>
<Card style={{ flex: 1 }}>
<Col gap={4}>
<Label size={9} color="#bbb">GROSS PROFIT</Label>
<Box w={60} h={18} rounded={4} />
</Col>
</Card>
<Card style={{ flex: 1 }}>
<Col gap={4}>
<Label size={9} color="#bbb">TOTAL UTANG</Label>
<Box w={60} h={18} rounded={4} />
</Col>
</Card>
</Row>
{/_ Payroll countdown _/}
<Card>
<Row justify="space-between">
<Col gap={2}>
<Label size={10} color="#999">NEXT PAYROLL</Label>
<Label size={13} weight={600} color="#222">3 days away</Label>
<Label size={10} color="#bbb">Dec 15 cutoff · 8 employees</Label>
</Col>
<Btn label="Run now" small outline />
</Row>
</Card>
{/_ Low stock _/}
<Col gap={6}>
<Row justify="space-between">
<Label size={12} weight={600} color="#222">Low Stock Alerts</Label>
<Label size={11} color="#aaa">See all</Label>
</Row>
{["Rice (5kg sack)", "Cooking Oil 1L", "Canned Goods"].map((item, i) => (
<Card key={i}>
<Row justify="space-between">
<Col gap={2}>
<Label size={12} color="#222">{item}</Label>
<Label size={10} color="#bbb">2 left · threshold: 5</Label>
</Col>
<Badge label="Low" color="#f5f5f5" />
</Row>
</Card>
))}
</Col>
{/_ Recent transactions _/}
<Col gap={6}>
<Label size={12} weight={600} color="#222">Recent Transactions</Label>
{[1, 2, 3].map(i => (
<Row key={i} justify="space-between" align="center">
<Row gap={10}>
<Box w={32} h={32} rounded={8} />
<Col gap={2}>
<Box w={100} h={12} rounded={3} />
<Box w={60} h={10} rounded={3} />
</Col>
</Row>
<Box w={50} h={14} rounded={4} />
</Row>
))}
</Col>
</Col>
</Col>
</Phone>
);

const InventoryListScreen = () => (
<Phone active="Inventory">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Label size={15} weight={700} color="#222">Inventory</Label>
<Row gap={8}>
<Btn label="Import" small outline />
<Btn label="+ Add" small />
</Row>
</Row>
<div style={{ marginTop: 10, height: 36, border: "1px solid #ddd", borderRadius: 8, background: "#fafafa", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
<Icon size={14} />
<Label size={11} color="#ccc">Search products...</Label>
</div>
{/_ Category tabs _/}
<Row gap={6} style={{ marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
{["All", "Drinks", "Canned", "Snacks", "Others"].map((cat, i) => (
<div key={cat} style={{ padding: "4px 12px", borderRadius: 20, background: i === 0 ? "#222" : "#f0f0f0", flexShrink: 0 }}>
<Label size={10} color={i === 0 ? "#fff" : "#888"}>{cat}</Label>
</div>
))}
</Row>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
{[
{ name: "Coca Cola 1.5L", stock: 24, low: false },
{ name: "Rice 5kg Sack", stock: 2, low: true },
{ name: "Cooking Oil 1L", stock: 3, low: true },
{ name: "Lucky Me Noodles", stock: 48, low: false },
{ name: "Canned Sardines", stock: 12, low: false },
].map((item, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "12px 0" }}>
<Row gap={10}>
<Box w={40} h={40} rounded={8} />
<Col gap={3}>
<Label size={13} weight={500} color="#222">{item.name}</Label>
<Row gap={6}>
<Label size={11} color="#bbb">{item.stock} in stock</Label>
{item.low && <Badge label="Low" color="#f0f0f0" />}
</Row>
</Col>
</Row>
<Col gap={2} style={{ alignItems: "flex-end" }}>
<Box w={50} h={14} rounded={4} />
<Box w={35} h={11} rounded={3} />
</Col>
</Row>
<Line />
</div>
))}
</Col>
{/_ FAB _/}
<div style={{ position: "absolute", bottom: 70, right: 16, width: 44, height: 44, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={22} color="#fff" weight={300}>+</Label>
</div>
</Col>
</Phone>
);

const InventoryAddScreen = () => (
<Phone active="Inventory">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row gap={10} align="center">
<Icon size={20} />
<Label size={15} weight={700} color="#222">Add Product</Label>
</Row>
</div>
<Col gap={14} style={{ flex: 1, overflow: "auto", padding: 16 }}>
<Input label="Product name *" />
<Col gap={4}>
<Label size={10} color="#bbb">Category</Label>
<div style={{ height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
<Label size={11} color="#ccc">Type or select...</Label>
<Icon size={14} />
</div>
<Row gap={4} style={{ flexWrap: "wrap" }}>
{["Drinks", "Canned", "Snacks"].map(c => (
<div key={c} style={{ padding: "3px 10px", borderRadius: 20, background: "#f0f0f0" }}>
<Label size={10} color="#888">{c}</Label>
</div>
))}
</Row>
</Col>
<Col gap={4}>
<Label size={10} color="#bbb">Unit _</Label>
<div style={{ height: 36, border: "1px solid #ddd", borderRadius: 6, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
<Label size={11} color="#555">Piece</Label>
<Icon size={14} />
</div>
</Col>
<Row gap={10}>
<Input label="Buying price _" w="50%" />
<Input label="Selling price *" w="50%" />
</Row>
<Row gap={10}>
<Input label="Initial stock" w="50%" />
<Input label="Low stock alert" w="50%" />
</Row>
<Col gap={4}>
<Label size={10} color="#bbb">Photo (optional)</Label>
<div style={{ height: 80, border: "1.5px dashed #ddd", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={11} color="#ccc">Tap to upload</Label>
</div>
</Col>
</Col>
<div style={{ padding: 16, borderTop: "1px solid #efefef" }}>
<Btn label="Save Product" full />
</div>
</Col>
</Phone>
);

const InventoryDetailScreen = () => (
<Phone active="Inventory">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Row gap={8}>
<Icon size={20} />
<Label size={14} weight={700} color="#222">Product Detail</Label>
</Row>
<Row gap={6}>
<Btn label="Edit" small outline />
<Icon size={20} />
</Row>
</Row>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto" }}>
{/_ Product header _/}
<Col gap={10} style={{ padding: 16, borderBottom: "1px solid #efefef" }}>
<Row gap={12}>
<Box w={56} h={56} rounded={10} />
<Col gap={4}>
<Label size={15} weight={700} color="#222">Coca Cola 1.5L</Label>
<Row gap={6}>
<Badge label="Drinks" />
<Badge label="Bottle" />
</Row>
</Col>
</Row>
<Row gap={8}>
<Card style={{ flex: 1, background: "#f7f7f7" }}>
<Col gap={2}>
<Label size={9} color="#bbb">CURRENT STOCK</Label>
<Label size={18} weight={700} color="#222">24</Label>
<Label size={10} color="#bbb">bottles</Label>
</Col>
</Card>
<Card style={{ flex: 1, background: "#f7f7f7" }}>
<Col gap={2}>
<Label size={9} color="#bbb">SELLING PRICE</Label>
<Box w={60} h={18} rounded={4} />
</Col>
</Card>
<Card style={{ flex: 1, background: "#f7f7f7" }}>
<Col gap={2}>
<Label size={9} color="#bbb">BUYING PRICE</Label>
<Box w={60} h={18} rounded={4} />
</Col>
</Card>
</Row>
<Row gap={8}>
<Btn label="Restock" full outline />
<Btn label="Adjust" full outline />
</Row>
</Col>
{/_ Movement history _/}
<Col gap={0} style={{ padding: "12px 16px" }}>
<Label size={12} weight={600} color="#222" style={{ marginBottom: 10 }}>Stock History</Label>
{[
{ type: "Sale", qty: "-3", note: "POS Transaction" },
{ type: "Restock", qty: "+24", note: "From supplier" },
{ type: "Adjustment", qty: "-1", note: "Damaged goods" },
{ type: "Sale", qty: "-6", note: "POS Transaction" },
].map((item, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "10px 0" }}>
<Row gap={10}>
<Box w={32} h={32} rounded={8} />
<Col gap={2}>
<Label size={12} color="#222">{item.type}</Label>
<Label size={10} color="#bbb">{item.note}</Label>
</Col>
</Row>
<Col gap={2} style={{ alignItems: "flex-end" }}>
<Label size={13} weight={600} color={item.qty.startsWith("+") ? "#555" : "#222"}>{item.qty}</Label>
<Box w={50} h={10} rounded={3} />
</Col>
</Row>
{i < 3 && <Line />}
</div>
))}
</Col>
</Col>
</Col>
</Phone>
);

const ImportScreen = () => (
<Phone active="Inventory">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row gap={8}>
<Icon size={20} />
<Label size={14} weight={700} color="#222">Import Products</Label>
</Row>
</div>
<Col gap={16} style={{ flex: 1, overflow: "auto", padding: 16 }}>
{/_ Step 1 _/}
<Col gap={8}>
<Row gap={8} align="center">
<div style={{ width: 20, height: 20, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={10} color="#fff" weight={700}>1</Label>
</div>
<Label size={12} weight={600} color="#222">Download Template</Label>
</Row>
<Card style={{ background: "#fafafa" }}>
<Row justify="space-between" align="center">
<Col gap={2}>
<Label size={12} color="#222">products_template.xlsx</Label>
<Label size={10} color="#bbb">Fill this in and upload below</Label>
</Col>
<Btn label="Download" small outline />
</Row>
</Card>
</Col>
{/_ Step 2 _/}
<Col gap={8}>
<Row gap={8} align="center">
<div style={{ width: 20, height: 20, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={10} color="#fff" weight={700}>2</Label>
</div>
<Label size={12} weight={600} color="#222">Upload Your File</Label>
</Row>
<div style={{ height: 100, border: "2px dashed #ddd", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
<Icon size={28} />
<Label size={11} color="#bbb">Tap to upload CSV or Excel</Label>
</div>
</Col>
{/_ Step 3 — Preview _/}
<Col gap={8}>
<Row gap={8} align="center">
<div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={10} color="#888" weight={700}>3</Label>
</div>
<Label size={12} weight={600} color="#bbb">Preview & Confirm</Label>
</Row>
<Card style={{ background: "#fafafa" }}>
<Col gap={6}>
<Row justify="space-between">
{["Name", "Category", "Price", "Stock"].map(h => (
<Label key={h} size={9} color="#bbb" weight={600}>{h}</Label>
))}
</Row>
<Line />
{[1, 2, 3].map(i => (
<Row key={i} justify="space-between">
{[80, 50, 40, 30].map((w, j) => (
<Box key={j} w={w} h={10} rounded={3} />
))}
</Row>
))}
<Label size={10} color="#bbb" style={{ marginTop: 4 }}>Showing 3 of 24 rows</Label>
</Col>
</Card>
</Col>
</Col>
<div style={{ padding: 16, borderTop: "1px solid #efefef" }}>
<Btn label="Import 24 Products" full />
</div>
</Col>
</Phone>
);

const POSSelectorScreen = () => (
<Phone active="POS">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Label size={15} weight={700} color="#222">New Sale</Label>
<Row gap={6}>
<div style={{ padding: "4px 10px", background: "#222", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
<Label size={10} color="#fff">3 items</Label>
</div>
<Btn label="Cart →" small />
</Row>
</Row>
<div style={{ marginTop: 10, height: 36, border: "1px solid #ddd", borderRadius: 8, background: "#fafafa", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
<Icon size={14} />
<Label size={11} color="#ccc">Search products...</Label>
</div>
<Row gap={6} style={{ marginTop: 10, overflowX: "auto" }}>
{["All", "Drinks", "Canned", "Snacks"].map((cat, i) => (
<div key={cat} style={{ padding: "4px 12px", borderRadius: 20, background: i === 0 ? "#222" : "#f0f0f0", flexShrink: 0 }}>
<Label size={10} color={i === 0 ? "#fff" : "#888"}>{cat}</Label>
</div>
))}
</Row>
</div>
<div style={{ flex: 1, overflow: "auto", padding: 12 }}>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
{[
{ name: "Coca Cola 1.5L", stock: 24, selected: true },
{ name: "Lucky Me Noodles", stock: 48, selected: false },
{ name: "Canned Sardines", stock: 12, selected: true },
{ name: "Cooking Oil 1L", stock: 3, selected: false },
{ name: "Rice 5kg Sack", stock: 2, selected: true },
{ name: "Chippy 110g", stock: 20, selected: false },
].map((item, i) => (
<Card key={i} style={{ position: "relative", outline: item.selected ? "2px solid #222" : "none" }}>
{item.selected && (
<div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={10} color="#fff">✓</Label>
</div>
)}
<Col gap={6}>
<Box w="100%" h={50} rounded={6} />
<Label size={11} weight={500} color="#222">{item.name}</Label>
<Row justify="space-between">
<Box w={45} h={12} rounded={3} />
<Label size={10} color="#bbb">{item.stock} left</Label>
</Row>
</Col>
</Card>
))}
</div>
</div>
</Col>
</Phone>
);

const POSCartScreen = () => (
<Phone active="POS">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row gap={8}>
<Icon size={20} />
<Label size={15} weight={700} color="#222">Cart</Label>
</Row>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto" }}>
<Col gap={0} style={{ padding: "8px 16px" }}>
{[
{ name: "Coca Cola 1.5L", qty: 2 },
{ name: "Canned Sardines", qty: 3 },
{ name: "Rice 5kg Sack", qty: 1 },
].map((item, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "12px 0" }}>
<Row gap={10}>
<Box w={40} h={40} rounded={8} />
<Col gap={2}>
<Label size={12} weight={500} color="#222">{item.name}</Label>
<Box w={50} h={11} rounded={3} />
</Col>
</Row>
<Row gap={8} align="center">
<div style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={14} color="#555">−</Label>
</div>
<Label size={13} weight={600} color="#222">{item.qty}</Label>
<div style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Label size={14} color="#555">+</Label>
</div>
</Row>
</Row>
{i < 2 && <Line />}
</div>
))}
</Col>
<Line />
{/_ Discount _/}
<Col gap={8} style={{ padding: 16 }}>
<Label size={12} weight={600} color="#222">Discount</Label>
<Row gap={8}>
{["No discount", "Fixed amount", "Percentage"].map((opt, i) => (
<div key={opt} style={{ padding: "6px 10px", borderRadius: 20, background: i === 0 ? "#222" : "#f0f0f0", flexShrink: 0 }}>
<Label size={10} color={i === 0 ? "#fff" : "#888"}>{opt}</Label>
</div>
))}
</Row>
</Col>
<Line />
{/_ Summary _/}
<Col gap={8} style={{ padding: 16 }}>
{[["Subtotal", ""], ["Discount", "—"], ["Total", ""]].map(([label, val], i) => (
<Row key={i} justify="space-between">
<Label size={i === 2 ? 14 : 12} weight={i === 2 ? 700 : 400} color={i === 2 ? "#222" : "#888"}>{label}</Label>
<Box w={60} h={i === 2 ? 16 : 12} rounded={4} />
</Row>
))}
</Col>
</Col>
<div style={{ padding: 16, borderTop: "1px solid #efefef" }}>
<Btn label="Proceed to Payment →" full />
</div>
</Col>
</Phone>
);

const POSPaymentScreen = () => (
<Phone active="POS">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row gap={8}>
<Icon size={20} />
<Label size={15} weight={700} color="#222">Payment</Label>
</Row>
</div>
<Col gap={16} style={{ flex: 1, overflow: "auto", padding: 16 }}>
{/_ Total _/}
<Card style={{ background: "#f7f7f7", textAlign: "center" }}>
<Col gap={4} style={{ alignItems: "center" }}>
<Label size={11} color="#bbb">AMOUNT DUE</Label>
<Box w={120} h={36} rounded={8} />
</Col>
</Card>
{/_ Payment method _/}
<Col gap={8}>
<Label size={12} weight={600} color="#222">Payment Method</Label>
<Row gap={8}>
{["Cash", "GCash", "Utang"].map((method, i) => (
<div key={method} style={{ flex: 1, padding: "10px 0", border: i === 0 ? "2px solid #222" : "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
<Icon size={20} />
<Label size={11} weight={i === 0 ? 600 : 400} color={i === 0 ? "#222" : "#888"}>{method}</Label>
</div>
))}
</Row>
</Col>
{/_ Cash input _/}
<Col gap={8}>
<Input label="Cash received" />
<Card style={{ background: "#fafafa" }}>
<Row justify="space-between">
<Label size={12} color="#888">Change</Label>
<Box w={60} h={16} rounded={4} />
</Row>
</Card>
</Col>
{/_ Quick amounts _/}
<Col gap={6}>
<Label size={10} color="#bbb">QUICK AMOUNTS</Label>
<Row gap={6} style={{ flexWrap: "wrap" }}>
{["₱50", "₱100", "₱200", "₱500", "₱1000"].map(amt => (
<div key={amt} style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: 20 }}>
<Label size={11} color="#555">{amt}</Label>
</div>
))}
</Row>
</Col>
</Col>
<div style={{ padding: 16, borderTop: "1px solid #efefef" }}>
<Btn label="Complete Sale ✓" full />
</div>
</Col>
</Phone>
);

const UtangListScreen = () => (
<Phone active="Utang">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Label size={15} weight={700} color="#222">Utang</Label>
<Btn label="+ Add" small />
</Row>
{/_ Total outstanding _/}
<Card style={{ background: "#f7f7f7", marginTop: 10 }}>
<Row justify="space-between" align="center">
<Col gap={2}>
<Label size={10} color="#bbb">TOTAL OUTSTANDING</Label>
<Box w={100} h={22} rounded={6} />
</Col>
<Label size={11} color="#bbb">12 customers</Label>
</Row>
</Card>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
{["Aling Nena", "Kuya Ben", "Ate Rosa", "Mang Rudy", "Joy Santos"].map((name, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "12px 0" }}>
<Row gap={10}>
<Avatar size={36} />
<Col gap={2}>
<Label size={13} weight={500} color="#222">{name}</Label>
<Label size={10} color="#bbb">Last: 2 days ago · 3 transactions</Label>
</Col>
</Row>
<Col gap={2} style={{ alignItems: "flex-end" }}>
<Box w={60} h={14} rounded={4} />
<Badge label="Unpaid" color="#f0f0f0" />
</Col>
</Row>
<Line />
</div>
))}
</Col>
</Col>
</Phone>
);

const PayrollListScreen = () => (
<Phone active="Payroll">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row justify="space-between" align="center">
<Label size={15} weight={700} color="#222">Payroll</Label>
<Row gap={6}>
<Btn label="Import" small outline />
<Btn label="+ Add" small />
</Row>
</Row>
<Card style={{ background: "#f7f7f7", marginTop: 10 }}>
<Row justify="space-between" align="center">
<Col gap={2}>
<Label size={10} color="#bbb">NEXT CUTOFF</Label>
<Label size={13} weight={600} color="#222">December 15</Label>
<Label size={10} color="#bbb">3 days away · 8 employees</Label>
</Col>
<Btn label="Run Payroll" small />
</Row>
</Card>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
{["Maria Santos", "Juan dela Cruz", "Ana Reyes", "Pedro Lim", "Rosa Garcia"].map((name, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "12px 0" }}>
<Row gap={10}>
<Avatar size={36} />
<Col gap={2}>
<Label size={13} weight={500} color="#222">{name}</Label>
<Label size={10} color="#bbb">Regular · Monthly</Label>
</Col>
</Row>
<Col gap={2} style={{ alignItems: "flex-end" }}>
<Box w={70} h={14} rounded={4} />
<Badge label="Active" color="#f0f0f0" />
</Col>
</Row>
<Line />
</div>
))}
</Col>
</Col>
</Phone>
);

const PayrollRunScreen = () => (
<Phone active="Payroll">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Row gap={8}>
<Icon size={20} />
<Col gap={1}>
<Label size={14} weight={700} color="#222">Run Payroll</Label>
<Label size={10} color="#bbb">Dec 1–15, 2024</Label>
</Col>
</Row>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
{["Maria Santos", "Juan dela Cruz", "Ana Reyes"].map((name, i) => (
<Card key={i} style={{ marginBottom: 8 }}>
<Col gap={8}>
<Row justify="space-between" align="center">
<Row gap={8}>
<Avatar size={28} />
<Label size={13} weight={600} color="#222">{name}</Label>
</Row>
<Icon size={16} />
</Row>
<Line h={1} />
<Row justify="space-between">
<Label size={11} color="#888">Basic Pay</Label>
<Box w={60} h={12} rounded={3} />
</Row>
<Row justify="space-between">
<Label size={11} color="#888">SSS</Label>
<Box w={40} h={12} rounded={3} />
</Row>
<Row justify="space-between">
<Label size={11} color="#888">PhilHealth</Label>
<Box w={40} h={12} rounded={3} />
</Row>
<Row justify="space-between">
<Label size={11} color="#888">Pag-IBIG</Label>
<Box w={40} h={12} rounded={3} />
</Row>
<Row justify="space-between">
<Label size={11} color="#888">Tax</Label>
<Box w={40} h={12} rounded={3} />
</Row>
<Line h={1} />
<Row justify="space-between">
<Label size={12} weight={700} color="#222">Net Pay</Label>
<Box w={70} h={16} rounded={4} />
</Row>
<Row gap={6}>
<Btn label="+ Add" small outline />
<Btn label="− Deduct" small outline />
</Row>
</Col>
</Card>
))}
</Col>
<div style={{ padding: 16, borderTop: "1px solid #efefef" }}>
<Row gap={8}>
<Btn label="Save Draft" full outline />
<Btn label="Finalize & Generate" full />
</Row>
</div>
</Col>
</Phone>
);

const SettingsScreen = () => (
<Phone active="Home">
<Col gap={0} style={{ height: "100%" }}>
<div style={{ padding: "12px 16px", borderBottom: "1px solid #efefef" }}>
<Label size={15} weight={700} color="#222">Settings</Label>
</div>
<Col gap={0} style={{ flex: 1, overflow: "auto" }}>
{/_ Business _/}
<Col gap={0} style={{ padding: "16px 16px 8px" }}>
<Label size={10} color="#bbb" style={{ marginBottom: 8 }}>BUSINESS</Label>
<Card>
<Row gap={12} align="center">
<Box w={48} h={48} rounded={10} />
<Col gap={2} style={{ flex: 1 }}>
<Label size={14} weight={600} color="#222">Ate Marie's Sari-sari</Label>
<Label size={11} color="#bbb">Retail · Philippines · PHP</Label>
</Col>
<Btn label="Edit" small outline />
</Row>
</Card>
</Col>
{/_ Switch business _/}
<Col gap={0} style={{ padding: "8px 16px" }}>
{[
"Switch Business",
"Add New Business",
].map((item, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "14px 0" }}>
<Label size={13} color="#222">{item}</Label>
<Icon size={16} />
</Row>
<Line />
</div>
))}
</Col>
{/_ Account _/}
<Col gap={0} style={{ padding: "8px 16px" }}>
<Label size={10} color="#bbb" style={{ marginBottom: 8 }}>ACCOUNT</Label>
{["Change Email", "Change Password", "Export All Data"].map((item, i) => (
<div key={i}>
<Row justify="space-between" align="center" style={{ padding: "14px 0" }}>
<Label size={13} color="#222">{item}</Label>
<Icon size={16} />
</Row>
<Line />
</div>
))}
</Col>
{/_ Danger _/}
<Col gap={0} style={{ padding: "8px 16px" }}>
<div style={{ padding: "14px 0" }}>
<Label size={13} color="#cc4444">Sign Out</Label>
</div>
</Col>
</Col>
</Col>
</Phone>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const screenComponents = {
login: LoginScreen,
onboarding: OnboardingScreen,
businessSwitcher: BusinessSwitcherScreen,
dashboard: DashboardScreen,
inventoryList: InventoryListScreen,
inventoryAdd: InventoryAddScreen,
inventoryDetail: InventoryDetailScreen,
inventoryImport: ImportScreen,
posSelector: POSSelectorScreen,
posCart: POSCartScreen,
posPayment: POSPaymentScreen,
utangList: UtangListScreen,
payrollEmployees: PayrollListScreen,
payrollRun: PayrollRunScreen,
settings: SettingsScreen,
};

const groups = [
{ label: "Auth & Setup", keys: ["login", "onboarding", "businessSwitcher"] },
{ label: "Dashboard", keys: ["dashboard"] },
{ label: "Inventory", keys: ["inventoryList", "inventoryAdd", "inventoryDetail", "inventoryImport"] },
{ label: "POS", keys: ["posSelector", "posCart", "posPayment"] },
{ label: "Utang", keys: ["utangList"] },
{ label: "Payroll", keys: ["payrollEmployees", "payrollRun"] },
{ label: "Settings", keys: ["settings"] },
];

export default function App() {
const [active, setActive] = useState("dashboard");

const ActiveScreen = screenComponents[active] || DashboardScreen;

return (
<div style={{ fontFamily: "system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
{/_ Header _/}
<div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "14px 24px" }}>
<Row justify="space-between" align="center">
<Col gap={2}>
<Label size={18} weight={700} color="#222">Paldo</Label>
<Label size={11} color="#bbb">MVP 1 — UI Wireframes</Label>
</Col>
<Label size={11} color="#bbb">{screens[active]}</Label>
</Row>
</div>

      <div style={{ display: "flex", gap: 0, minHeight: "calc(100vh - 57px)" }}>
        {/* Sidebar nav */}
        <div style={{ width: 200, background: "#fff", borderRight: "1px solid #e8e8e8", padding: "16px 0", flexShrink: 0 }}>
          {groups.map(group => (
            <div key={group.label} style={{ marginBottom: 16 }}>
              <Label size={9} color="#bbb" style={{ padding: "0 16px", marginBottom: 4, display: "block" }}>{group.label.toUpperCase()}</Label>
              {group.keys.map(key => (
                <div
                  key={key}
                  onClick={() => setActive(key)}
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    background: active === key ? "#f5f5f5" : "transparent",
                    borderLeft: active === key ? "2px solid #222" : "2px solid transparent",
                  }}
                >
                  <Label size={11} color={active === key ? "#222" : "#888"} weight={active === key ? 600 : 400}>
                    {screens[key]}
                  </Label>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px", gap: 40, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <ActiveScreen />
          </div>
          {/* Screen label */}
          <div style={{ position: "absolute", bottom: 0 }} />
        </div>
      </div>
    </div>

);
}
