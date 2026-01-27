import StockHistory from "@/src/components/stockRelated/StockHistory";


export default function TransactionsPage(){
    return (
        <section className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
            <StockHistory />
        </section>
    )
}