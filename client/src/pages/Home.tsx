import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Columns3,
  Download,
  Eye,
  FileCheck2,
  FileOutput,
  FileText,
  Filter,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Status = "Draft" | "Submitted" | "Approved" | "Docs generated" | "Signed & uploaded" | "Disbursed" | "Rejected";

type Application = {
  id: string;
  consumer: string;
  initials: string;
  vehicle: string;
  dealer: string;
  amount: string;
  status: Status;
  updated: string;
  submittedBy: string;
  documents: number;
  totalDocuments: number;
  tone: string;
  installment: string;
  tenor: string;
  nik: string;
};

const initialApplications: Application[] = [
  { id: "APP-240928-017", consumer: "Nadia Salsabila", initials: "NS", vehicle: "Toyota Yaris Cross 1.5 S", dealer: "Auto2000 Pasteur", amount: "Rp 286.500.000", status: "Submitted", updated: "8 min ago", submittedBy: "Raka Pranata", documents: 4, totalDocuments: 4, tone: "coral", installment: "Rp 6.420.000 / mo", tenor: "48 months", nik: "3273••••••••0182" },
  { id: "APP-240928-016", consumer: "Dimas Arya", initials: "DA", vehicle: "Honda HR-V 1.5 E", dealer: "Honda Mugen", amount: "Rp 314.800.000", status: "Approved", updated: "34 min ago", submittedBy: "Fina Rahma", documents: 4, totalDocuments: 4, tone: "sky", installment: "Rp 7.210.000 / mo", tenor: "48 months", nik: "3174••••••••9021" },
  { id: "APP-240928-015", consumer: "Putri Lestari", initials: "PL", vehicle: "Mitsubishi Xpander Ultimate", dealer: "Srikandi Diamond", amount: "Rp 268.000.000", status: "Docs generated", updated: "1 hr ago", submittedBy: "Raka Pranata", documents: 5, totalDocuments: 5, tone: "lilac", installment: "Rp 6.180.000 / mo", tenor: "48 months", nik: "3276••••••••7720" },
  { id: "APP-240928-014", consumer: "Bima Nugraha", initials: "BN", vehicle: "Suzuki Ertiga GX", dealer: "Sejahtera Motor", amount: "Rp 214.200.000", status: "Signed & uploaded", updated: "2 hrs ago", submittedBy: "Dewi Kartika", documents: 6, totalDocuments: 6, tone: "mint", installment: "Rp 5.030.000 / mo", tenor: "48 months", nik: "3271••••••••4461" },
  { id: "APP-240928-013", consumer: "Sari Wulandari", initials: "SW", vehicle: "Wuling Alvez EX", dealer: "Arista Wuling", amount: "Rp 192.750.000", status: "Draft", updated: "Yesterday", submittedBy: "Sari Wulandari", documents: 2, totalDocuments: 4, tone: "amber", installment: "Rp 4.680.000 / mo", tenor: "48 months", nik: "3275••••••••1148" },
  { id: "APP-240927-012", consumer: "Ilham Maulana", initials: "IM", vehicle: "Toyota Avanza 1.5 G", dealer: "Auto2000 Cibiru", amount: "Rp 248.900.000", status: "Disbursed", updated: "Yesterday", submittedBy: "Fina Rahma", documents: 6, totalDocuments: 6, tone: "blue", installment: "Rp 5.620.000 / mo", tenor: "48 months", nik: "3273••••••••6084" },
];

const statusMeta: Record<Status, { label: string; className: string; dot: string }> = {
  Draft: { label: "Draft", className: "status-neutral", dot: "bg-slate-400" },
  Submitted: { label: "Needs review", className: "status-orange", dot: "bg-orange-500" },
  Approved: { label: "Approved", className: "status-green", dot: "bg-emerald-500" },
  "Docs generated": { label: "Docs ready", className: "status-purple", dot: "bg-violet-500" },
  "Signed & uploaded": { label: "Signed docs", className: "status-blue", dot: "bg-sky-500" },
  Disbursed: { label: "Disbursed", className: "status-green", dot: "bg-teal-500" },
  Rejected: { label: "Rejected", className: "status-red", dot: "bg-red-500" },
};

const stages = [
  { label: "Draft", count: 18, tone: "slate" },
  { label: "Submitted", count: 12, tone: "orange" },
  { label: "Approved", count: 9, tone: "green" },
  { label: "Docs generated", count: 7, tone: "purple" },
  { label: "Disbursed", count: 38, tone: "blue" },
];

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date("2026-09-28T07:00:00Z"));
}

function StatCard({ label, value, detail, icon: Icon, accent, bars }: { label: string; value: string; detail: string; icon: typeof Activity; accent: string; bars: number[] }) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`stat-icon ${accent}`}><Icon className="h-[18px] w-[18px]" /></div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-[12px] font-medium text-slate-500">{detail}</span>
        <div className="sparkline" aria-hidden="true">
          {bars.map((height, index) => <span key={index} style={{ height: `${height}px` }} />)}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const meta = statusMeta[status];
  return <span className={`status-pill ${meta.className}`}><span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />{meta.label}</span>;
}

function ApplicationDrawer({ application, onClose, onAction }: { application: Application; onClose: () => void; onAction: (action: "approve" | "generate" | "disburse") => void }) {
  const completed = application.documents === application.totalDocuments;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]" onClick={onClose}>
      <aside className="drawer-panel" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5">
          <div>
            <p className="eyebrow text-indigo-600">Application detail</p>
            <h2 className="mt-1 text-[21px] font-bold tracking-[-0.03em] text-slate-950">{application.id}</h2>
            <p className="mt-1 text-[13px] text-slate-500">Last updated {application.updated}</p>
          </div>
          <button onClick={onClose} className="icon-button" aria-label="Close application detail"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className={`avatar avatar-${application.tone}`}>{application.initials}</div>
            <div>
              <p className="font-semibold text-slate-950">{application.consumer}</p>
              <p className="text-[12px] text-slate-500">{application.nik}</p>
            </div>
            <div className="ml-auto"><StatusPill status={application.status} /></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="drawer-metric"><p className="eyebrow">Loan amount</p><p className="mt-1 text-[15px] font-bold text-slate-950">{application.amount}</p></div>
            <div className="drawer-metric"><p className="eyebrow">Tenor</p><p className="mt-1 text-[15px] font-bold text-slate-950">{application.tenor}</p></div>
          </div>

          <section className="mt-7">
            <div className="flex items-center justify-between"><h3 className="section-title">Vehicle & dealer</h3><button className="text-[12px] font-semibold text-indigo-600">Edit</button></div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-3"><div className="icon-tile bg-white"><CarFront className="h-4 w-4 text-indigo-600" /></div><div><p className="text-[13px] font-semibold text-slate-900">{application.vehicle}</p><p className="text-[12px] text-slate-500">{application.dealer}</p></div></div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]"><div><p className="text-slate-400">Monthly installment</p><p className="mt-1 font-semibold text-slate-800">{application.installment}</p></div><div><p className="text-slate-400">Submitted by</p><p className="mt-1 font-semibold text-slate-800">{application.submittedBy}</p></div></div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between"><h3 className="section-title">Required documents</h3><span className="text-[12px] font-semibold text-slate-500">{application.documents}/{application.totalDocuments} complete</span></div>
            <div className="mt-3 space-y-2">
              {["KTP consumer", "Proof of down payment", "Application form", "KK / family card", ...(application.documents > 4 ? ["Contract — signed", "PO — signed"] : [])].map((doc, index) => {
                const isDone = index < application.documents;
                return <div key={doc} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5"><div className="flex items-center gap-2.5"><div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{isDone ? <Check className="h-3.5 w-3.5" /> : <UploadCloud className="h-3.5 w-3.5" />}</div><span className={`text-[12px] ${isDone ? "text-slate-700" : "text-slate-400"}`}>{doc}</span></div>{isDone && <button className="text-[11px] font-semibold text-indigo-600">View</button>}</div>;
              })}
            </div>
            {!completed && <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-orange-700"><AlertCircle className="h-3.5 w-3.5" />Complete the missing documents before submitting.</p>}
          </section>

          <section className="mt-7">
            <h3 className="section-title">Application timeline</h3>
            <div className="mt-4 space-y-4 pl-1">
              {[{ label: "Application created", meta: "28 Sep · 08:42", done: true }, { label: "Documents validated", meta: completed ? "28 Sep · 08:49" : "Waiting for documents", done: completed }, { label: "Supervisor review", meta: application.status === "Submitted" ? "Waiting for review" : "28 Sep · 09:06", done: application.status !== "Submitted" && application.status !== "Draft" }, { label: "Disbursement", meta: application.status === "Disbursed" ? "27 Sep · 16:20" : "Not started", done: application.status === "Disbursed" }].map((item) => <div key={item.label} className="flex gap-3"><div className={`relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>{item.done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</div><div><p className={`text-[12px] font-semibold ${item.done ? "text-slate-800" : "text-slate-400"}`}>{item.label}</p><p className="mt-0.5 text-[11px] text-slate-400">{item.meta}</p></div></div>)}
            </div>
          </section>
        </div>
        <div className="border-t border-slate-200/80 bg-white px-6 py-4">
          {application.status === "Submitted" && <button disabled={!completed} onClick={() => onAction("approve")} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 className="h-4 w-4" />Approve application</button>}
          {application.status === "Approved" && <button onClick={() => onAction("generate")} className="primary-button w-full"><FileOutput className="h-4 w-4" />Generate contract & PO</button>}
          {(application.status === "Docs generated" || application.status === "Signed & uploaded") && <button onClick={() => onAction("disburse")} className="primary-button w-full"><CircleDollarSign className="h-4 w-4" />Mark as disbursed</button>}
          {application.status === "Draft" && <button onClick={() => toast.info("Draft editing is ready for the next build phase.")} className="secondary-button mt-2 w-full"><Eye className="h-4 w-4" />Continue application</button>}
          {application.status === "Disbursed" && <button onClick={() => toast.info("Disbursement receipt preview opened.")} className="secondary-button w-full"><FileText className="h-4 w-4" />View disbursement receipt</button>}
        </div>
      </aside>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [applications, setApplications] = useState(initialApplications);
  const [selected, setSelected] = useState<Application | null>(null);
  const [activeView, setActiveView] = useState("Overview");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filter, setFilter] = useState<Status | "All">("All");

  const visibleApplications = useMemo(() => applications.filter((application) => {
    const searchMatch = `${application.consumer} ${application.id} ${application.vehicle}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === "All" || application.status === filter;
    return searchMatch && filterMatch;
  }), [applications, filter, search]);

  function navTo(view: string) {
    setActiveView(view);
    setMobileMenu(false);
    if (view !== "Overview") toast.info(`${view} workspace is ready to connect to live data.`);
  }

  function applyAction(action: "approve" | "generate" | "disburse") {
    if (!selected) return;
    const nextStatus: Record<typeof action, Status> = { approve: "Approved", generate: "Docs generated", disburse: "Disbursed" };
    const next = { ...selected, status: nextStatus[action], updated: "Just now" };
    setApplications((current) => current.map((item) => item.id === selected.id ? next : item));
    setSelected(next);
    toast.success(action === "approve" ? "Application approved" : action === "generate" ? "Contract and PO generated" : "Application marked as disbursed");
  }

  const displayName = user?.name?.split(" ")[0] || "Alya";
  const queueCount = applications.filter((application) => application.status === "Submitted").length;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="noise-overlay" />
      <div className="flex min-h-screen">
        <aside className={`${mobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-40 flex w-[246px] flex-col border-r border-slate-200/80 bg-white/90 px-4 py-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shadow-none`}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5"><div className="brand-mark"><span /></div><div><p className="brand-wordmark">Credit<span>Flow</span></p><p className="brand-subtitle">PT. JKL operations</p></div></div>
            <button className="icon-button lg:hidden" onClick={() => setMobileMenu(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-8 px-2"><div className="workspace-select"><div className="workspace-dot" /><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-slate-800">Jakarta branch</p><p className="truncate text-[10px] text-slate-400">Motor credit / production</p></div><ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" /></div></div>
          <div className="mt-8"><p className="nav-label">Workspace</p><nav className="mt-2 space-y-1">
            {[{ label: "Overview", icon: LayoutDashboard }, { label: "Applications", icon: FileText, count: queueCount }, { label: "Documents", icon: FileCheck2 }, { label: "Disbursements", icon: WalletCards }, { label: "Team access", icon: Users }].map(({ label, icon: Icon, count }) => <button key={label} onClick={() => navTo(label)} className={`nav-item ${activeView === label ? "nav-item-active" : ""}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{count ? <span className="nav-count">{count}</span> : null}</button>)}
          </nav></div>
          <div className="mt-auto space-y-4"><div className="sidebar-tip"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-orange-500" /><p className="text-[11px] font-bold text-slate-800">Friday focus</p></div><p className="mt-2 text-[11px] leading-4 text-slate-500">Clear the 12 applications waiting for supervisor review.</p><button onClick={() => { setFilter("Submitted"); setActiveView("Applications"); }} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-600">Open review queue <ArrowUpRight className="h-3 w-3" /></button></div><div className="border-t border-slate-100 pt-4"><div className="flex items-center gap-2.5 px-2"><div className="avatar avatar-indigo h-8 w-8 text-[10px]">{(user?.name || "AP").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-[11px] font-bold text-slate-800">{user?.name || "Alya Putri"}</p><p className="truncate text-[10px] text-slate-400">Supervisor access</p></div><MoreHorizontal className="ml-auto h-4 w-4 text-slate-400" /></div></div></div>
        </aside>
        {mobileMenu && <button className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/70 bg-[#f6f7fb]/85 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex items-center gap-3"><button className="icon-button lg:hidden" onClick={() => setMobileMenu(true)}><Menu className="h-4 w-4" /></button><div className="hidden items-center gap-2 text-[11px] font-semibold text-slate-400 sm:flex"><span>Workspace</span><ChevronRight className="h-3 w-3" /><span className="text-slate-700">{activeView}</span></div><div className="relative sm:hidden"><p className="text-[11px] font-bold text-slate-800">{activeView}</p><p className="text-[10px] text-slate-400">Jakarta branch</p></div></div>
            <div className="flex items-center gap-2.5"><div className="search-field hidden w-[220px] md:flex"><Search className="h-3.5 w-3.5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" /></div><button className="icon-button relative" aria-label="Notifications" onClick={() => toast.info("You have 3 unread notifications.")}><Bell className="h-[17px] w-[17px]" /><span className="notification-dot" /></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><div className="avatar avatar-indigo h-8 w-8 text-[10px]">{(user?.name || "AP").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div className="hidden text-left sm:block"><p className="text-[11px] font-bold text-slate-800">{user?.name || "Alya Putri"}</p><p className="text-[10px] text-slate-400">Supervisor</p></div></div></div>
          </header>

          <div className="mx-auto max-w-[1480px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
            {activeView === "Overview" ? <>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-indigo-600">Monday, {formatToday()}</p><h1 className="page-title mt-2">Good morning, {displayName}<span className="text-orange-500">.</span></h1><p className="page-subtitle mt-2">Here’s the pulse of your credit operation today.</p></div><div className="flex items-center gap-2"><button onClick={() => toast.info("Export is available when live data is connected.")} className="secondary-button"><Download className="h-3.5 w-3.5" />Export</button><button onClick={() => setShowNew(true)} className="primary-button"><Plus className="h-4 w-4" />New application</button></div></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active applications" value="84" detail="↑ 12.5% vs last month" icon={FileText} accent="bg-indigo-100 text-indigo-700" bars={[8, 14, 11, 18, 21, 16, 24, 27, 22, 31]} /><StatCard label="Pending review" value="12" detail="4 due before 12:00" icon={Clock3} accent="bg-orange-100 text-orange-700" bars={[20, 19, 24, 17, 29, 23, 31, 28, 34, 30]} /><StatCard label="Approved this month" value="Rp 2,4B" detail="↑ 8.2% conversion" icon={CircleDollarSign} accent="bg-emerald-100 text-emerald-700" bars={[10, 12, 18, 15, 21, 20, 24, 29, 27, 34]} /><StatCard label="Document completeness" value="96%" detail="↑ 4.3% vs last month" icon={ShieldCheck} accent="bg-violet-100 text-violet-700" bars={[15, 17, 16, 21, 24, 23, 27, 26, 31, 35]} /></div>

              <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_40px_rgba(43,52,79,0.04)] sm:px-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="eyebrow">Application pipeline</p><p className="mt-1 text-[13px] font-semibold text-slate-800">Every application, visible from draft to disbursement.</p></div><button onClick={() => navTo("Applications")} className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">View all applications <ChevronRight className="h-3.5 w-3.5" /></button></div><div className="mt-5 grid gap-2 sm:grid-cols-5">{stages.map((stage, index) => <div key={stage.label} className="pipeline-item"><div className={`pipeline-number pipeline-${stage.tone}`}>{stage.count}</div><div className="min-w-0"><p className="truncate text-[11px] font-bold text-slate-700">{stage.label}</p><p className="mt-0.5 text-[10px] text-slate-400">{index === 1 ? "Needs action" : index === 4 ? "This month" : "In progress"}</p></div>{index < stages.length - 1 && <ChevronRight className="ml-auto hidden h-4 w-4 text-slate-300 sm:block" />}</div>)}</div></div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
                <section className="panel-card overflow-hidden"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div><div className="flex items-center gap-2"><h2 className="section-heading">Application queue</h2><span className="soft-count">{visibleApplications.length}</span></div><p className="mt-1 text-[12px] text-slate-400">Recent activity across your branch</p></div><div className="flex items-center gap-2"><button className="icon-button" onClick={() => setFilter(filter === "All" ? "Submitted" : "All")} title="Filter"><Filter className="h-3.5 w-3.5" /></button><button className="secondary-button px-3 py-2" onClick={() => navTo("Applications")}>View queue <ChevronRight className="h-3.5 w-3.5" /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="table-head"><th>Applicant</th><th>Vehicle / dealer</th><th>Loan amount</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>{visibleApplications.slice(0, 5).map((application) => <tr key={application.id} className="table-row" onClick={() => setSelected(application)}><td><div className="flex items-center gap-3"><div className={`avatar avatar-${application.tone}`}>{application.initials}</div><div><p className="text-[12px] font-bold text-slate-800">{application.consumer}</p><p className="mt-0.5 text-[10px] font-mono text-slate-400">{application.id}</p></div></div></td><td><p className="max-w-[175px] truncate text-[12px] font-semibold text-slate-700">{application.vehicle}</p><p className="mt-0.5 max-w-[175px] truncate text-[10px] text-slate-400">{application.dealer}</p></td><td><p className="text-[12px] font-semibold text-slate-700">{application.amount}</p><p className="mt-0.5 text-[10px] text-slate-400">{application.installment}</p></td><td><StatusPill status={application.status} /></td><td><span className="text-[11px] text-slate-400">{application.updated}</span></td><td><ChevronRight className="h-4 w-4 text-slate-300" /></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 sm:px-6"><p className="text-[11px] text-slate-400">Showing {Math.min(5, visibleApplications.length)} of 84 applications</p><button onClick={() => toast.info("Pagination is connected when live data is enabled.")} className="text-[11px] font-bold text-indigo-600">Load more</button></div></section>

                <section className="panel-card"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><h2 className="section-heading">Needs your attention</h2><p className="mt-1 text-[12px] text-slate-400">Small actions, big momentum</p></div><div className="icon-tile bg-orange-50 text-orange-600"><AlertCircle className="h-4 w-4" /></div></div><div className="space-y-1 px-3 py-3">{[{ icon: Clock3, title: "12 applications waiting for review", meta: "Oldest waiting 2h 14m", color: "orange", action: () => { setFilter("Submitted"); setActiveView("Applications"); } }, { icon: UploadCloud, title: "3 signed documents to verify", meta: "From Backoffice queue", color: "blue", action: () => navTo("Documents") }, { icon: FileOutput, title: "7 contracts ready to generate", meta: "All approvals complete", color: "purple", action: () => navTo("Documents") }].map((item) => <button key={item.title} onClick={item.action} className="attention-item"><div className={`attention-icon attention-${item.color}`}><item.icon className="h-4 w-4" /></div><div className="min-w-0 flex-1 text-left"><p className="truncate text-[12px] font-bold text-slate-700">{item.title}</p><p className="mt-1 text-[10px] text-slate-400">{item.meta}</p></div><ArrowUpRight className="h-4 w-4 text-slate-300" /></button>)}</div><div className="mx-5 mb-5 mt-2 rounded-xl bg-indigo-50/70 p-4"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-600" /><p className="text-[11px] font-bold text-indigo-900">Team throughput is up 18%</p></div><p className="mt-2 text-[11px] leading-4 text-indigo-700/70">You’re processing applications faster than any week this quarter.</p></div></section>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"><section className="panel-card"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><h2 className="section-heading">Recent activity</h2><p className="mt-1 text-[12px] text-slate-400">A live audit trail for your branch</p></div><button onClick={() => toast.info("Full audit log is available in the next build phase.")} className="icon-button"><Columns3 className="h-3.5 w-3.5" /></button></div><div className="space-y-5 px-5 py-5">{[{ icon: CheckCircle2, color: "green", title: "Dimas Arya was approved", meta: "Alya Putri · APP-240928-016", time: "34 min ago" }, { icon: FileOutput, color: "purple", title: "Contract & PO generated", meta: "For Putri Lestari · APP-240928-015", time: "1 hr ago" }, { icon: UploadCloud, color: "blue", title: "Signed documents uploaded", meta: "Bima Nugraha · 2 files", time: "2 hrs ago" }, { icon: UserRound, color: "orange", title: "New application created", meta: "Sari Wulandari · Draft", time: "Yesterday" }].map((item) => <div key={item.title} className="flex gap-3"><div className={`activity-dot activity-${item.color}`}><item.icon className="h-3.5 w-3.5" /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="text-[12px] font-semibold text-slate-700">{item.title}</p><span className="whitespace-nowrap text-[10px] text-slate-400">{item.time}</span></div><p className="mt-1 text-[10px] text-slate-400">{item.meta}</p></div></div>)}</div></section><section className="panel-card"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><h2 className="section-heading">Disbursement pulse</h2><p className="mt-1 text-[12px] text-slate-400">Monthly target: Rp 3,0B</p></div><button onClick={() => navTo("Disbursements")} className="text-[11px] font-bold text-indigo-600">Open report</button></div><div className="px-5 py-6"><div className="flex items-end justify-between"><div><p className="text-[31px] font-extrabold tracking-[-0.06em] text-slate-950">Rp 2,4B</p><p className="mt-1 text-[11px] text-emerald-600">80% of monthly target</p></div><div className="flex h-16 items-end gap-1.5">{[24, 33, 28, 44, 39, 48, 43, 57, 52, 61, 54, 66].map((height, index) => <span key={index} className={`w-2.5 rounded-t-sm ${index === 11 ? "bg-orange-400" : "bg-indigo-200"}`} style={{ height }} />)}</div></div><div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[80%] rounded-full bg-gradient-to-r from-indigo-500 to-orange-400" /></div><div className="mt-5 grid grid-cols-3 gap-3"><div><p className="eyebrow">Disbursed</p><p className="mt-1 text-[16px] font-bold text-slate-800">38</p></div><div><p className="eyebrow">Avg. TAT</p><p className="mt-1 text-[16px] font-bold text-slate-800">2.4d</p></div><div><p className="eyebrow">Conversion</p><p className="mt-1 text-[16px] font-bold text-slate-800">71%</p></div></div></div></section></div>
            </> : <div className="panel-card p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow text-indigo-600">{activeView}</p><h1 className="page-title mt-2">{activeView === "Applications" ? "Application queue" : activeView}</h1><p className="page-subtitle mt-2">{activeView === "Applications" ? "Review, filter, and move every application forward." : "This workspace is wired into the CreditFlow shell and ready for live data."}</p></div><button onClick={() => setShowNew(true)} className="primary-button self-start"><Plus className="h-4 w-4" />New application</button></div>{activeView === "Applications" ? <><div className="mt-7 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-5"><div className="search-field w-full sm:w-[260px]"><Search className="h-3.5 w-3.5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or ID" /></div>{(["All", "Submitted", "Approved", "Docs generated", "Disbursed"] as const).map((option) => <button key={option} onClick={() => setFilter(option)} className={`filter-chip ${filter === option ? "filter-chip-active" : ""}`}>{option}</button>)}</div><div className="mt-5 space-y-2">{visibleApplications.map((application) => <button key={application.id} onClick={() => setSelected(application)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/30"><div className={`avatar avatar-${application.tone}`}>{application.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-bold text-slate-800">{application.consumer}</p><p className="truncate text-[10px] text-slate-400">{application.id} · {application.vehicle}</p></div><div className="hidden text-right sm:block"><p className="text-[12px] font-semibold text-slate-700">{application.amount}</p><p className="mt-1 text-[10px] text-slate-400">{application.updated}</p></div><StatusPill status={application.status} /><ChevronRight className="h-4 w-4 text-slate-300" /></button>)}</div></> : <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-indigo-50 p-5"><LockKeyhole className="h-5 w-5 text-indigo-600" /><p className="mt-5 text-[13px] font-bold text-indigo-950">Role-based access</p><p className="mt-2 text-[11px] leading-4 text-indigo-700/70">Marketing, Supervisor, and Backoffice views are defined in the product model.</p></div><div className="rounded-2xl bg-orange-50 p-5"><UploadCloud className="h-5 w-5 text-orange-600" /><p className="mt-5 text-[13px] font-bold text-orange-950">Secure documents</p><p className="mt-2 text-[11px] leading-4 text-orange-700/70">KTP, KK, SPK, and signed files will live behind validated uploads.</p></div><div className="rounded-2xl bg-emerald-50 p-5"><Activity className="h-5 w-5 text-emerald-600" /><p className="mt-5 text-[13px] font-bold text-emerald-950">Full audit trail</p><p className="mt-2 text-[11px] leading-4 text-emerald-700/70">Every status change is designed to be attributable and reviewable.</p></div></div>}</div>}
          </div>
        </main>
      </div>

      {selected && <ApplicationDrawer application={selected} onClose={() => setSelected(null)} onAction={applyAction} />}
      {showNew && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow text-indigo-600">Create application</p><h2 className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-slate-950">Start a new credit case</h2><p className="mt-2 text-[12px] text-slate-500">Begin with the consumer and vehicle details. You can save this as a draft.</p></div><button onClick={() => setShowNew(false)} className="icon-button"><X className="h-4 w-4" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="form-field"><span>Consumer name</span><input placeholder="e.g. Nadia Salsabila" /></label><label className="form-field"><span>NIK</span><input placeholder="16 digit ID number" /></label><label className="form-field"><span>Vehicle</span><input placeholder="Brand, model, type" /></label><label className="form-field"><span>Dealer</span><input placeholder="Dealer name" /></label><label className="form-field"><span>Vehicle price</span><input placeholder="Rp 0" /></label><label className="form-field"><span>Tenor</span><select defaultValue="48"><option value="24">24 months</option><option value="36">36 months</option><option value="48">48 months</option><option value="60">60 months</option></select></label></div><div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="secondary-button" onClick={() => setShowNew(false)}>Cancel</button><button className="primary-button" onClick={() => { setShowNew(false); toast.success("Draft application created"); }}>Save as draft <ArrowUpRight className="h-3.5 w-3.5" /></button></div></div></div>}
    </div>
  );
}
