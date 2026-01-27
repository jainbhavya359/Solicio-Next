import Link from "next/link";
import Image from "next/image";

export default function ServiceCard({
  img,
  title,
  description,
  to,
  reverse,
}) {
  return (
    <div
      className={`grid items-center gap-10 md:grid-cols-[160px_1fr] ${
        reverse ? "md:grid-cols-[1fr_160px]" : ""
      }`}
    >
      {/* Icon */}
      <div
        className="
          flex items-center justify-center
          w-36 h-36 rounded-3xl
          bg-emerald-50
          shadow-sm
        "
      >
        <Image
          src={img}
          alt={title}
          width={80}
          height={80}
        />
      </div>

      {/* Content */}
      <div className="max-w-xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          {title}
        </h3>

        <p className="text-slate-600 leading-relaxed mb-5">
          {description}
        </p>

        {to && (
          <Link
            href={to}
            className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-lg
              bg-emerald-600 text-white
              font-medium
              hover:bg-emerald-700
              transition
            "
          >
            Explore service →
          </Link>
        )}
      </div>
    </div>
  );
}
