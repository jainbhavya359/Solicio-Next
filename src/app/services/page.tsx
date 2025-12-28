import Services from "@/src/components/Services";

const Service_data = [
{
    img: "/dictionary_.png",
    title: "Business Terminology",
    to: "/business",
    description:
    "Understand complex business jargon with crystal-clear explanations designed for real-world usage and confidence.",
    accent: "from-indigo-500 to-purple-500",
},
{
    img: "/credit-score_.png",
    title: "Loan & Credit Management",
    to: "/loan",
    description:
    "Track loans, improve credit scores, and access government-backed schemes and NGOs offering affordable funding.",
    accent: "from-emerald-500 to-teal-500",
},
{
    img: "/report_.png",
    title: "Operations Management",
    to: "/inventory",
    description:
    "Monitor inventory, sales performance, and workforce metrics—all from one powerful dashboard.",
    accent: "from-orange-500 to-pink-500",
},
{
    img: "/business-network_.png",
    title: "Local Wholesalers Network",
    description:
    "Find trusted wholesalers near you and build reliable supply chains without the headache.",
    accent: "from-blue-500 to-cyan-500",
},
{
    img: "/business_.png",
    title: "Marketing Solutions",
    to: "/marketing",
    description:
    "Launch digital campaigns, grow your brand presence, and collaborate with influencers that matter.",
    accent: "from-fuchsia-500 to-rose-500",
},
{
    img: "/certificate_.png",
    title: "Licenses & Certificates",
    to: "/licenses",
    description:
    "Never miss a compliance requirement—manage licenses and get personalized certification guidance.",
    accent: "from-yellow-500 to-amber-500",
},
];


export default function ServicesPage(){
    return(
        <section className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
            <Services service_data={Service_data}/>
        </section>
    );
}