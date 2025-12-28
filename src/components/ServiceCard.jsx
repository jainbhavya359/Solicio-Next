// ServiceCard.tsx (SERVER COMPONENT)
import Link from "next/link";
import Image from "next/image";

export default function ServiceCard({
  img,
  title,
  description,
  to,
  accent,
  reverse,
}) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } items-center gap-10`}
    >
      {/* Image */}
      <div
        className={`relative p-6 rounded-3xl bg-gradient-to-br ${accent} shadow-2xl`}
      >
        <Image
          src={img}
          alt={title}
          width={112}
          height={112}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        {to && (
          <Link
            href={to}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r ${accent} text-black hover:opacity-90 transition`}
          >
            Explore Service →
          </Link>
        )}
      </div>
    </div>
  );
}
