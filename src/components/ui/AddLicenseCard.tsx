"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function AddLicenseCard({ email }: any) {
  const [form, setForm] = useState({
    licenseName: "",
    licenseCategory: "Business",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    renewalRequired: true,
  });

  const submit = async () => {
    try {
      await axios.post("/api/licenses", {
        email,
        ...form,
      });

      toast.success("License added");
      setForm({
        licenseName: "",
        licenseCategory: "Business",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        renewalRequired: true,
      });
    } catch {
      toast.error("Failed to add license");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl">
      <h2 className="text-2xl font-bold mb-6">
        Add License
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="License name"
          value={form.licenseName}
          onChange={(e) =>
            setForm({ ...form, licenseName: e.target.value })
          }
          className="loan-input"
        />

        <input
          placeholder="Issuing authority"
          value={form.issuingAuthority}
          onChange={(e) =>
            setForm({
              ...form,
              issuingAuthority: e.target.value,
            })
          }
          className="loan-input"
        />

        <input
          type="date"
          value={form.issueDate}
          onChange={(e) =>
            setForm({ ...form, issueDate: e.target.value })
          }
          className="loan-input"
        />

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) =>
            setForm({ ...form, expiryDate: e.target.value })
          }
          className="loan-input"
        />
      </div>

      <button
        onClick={submit}
        className="mt-6 w-full py-3 rounded-full font-bold text-black
        bg-gradient-to-r from-indigo-400 to-pink-400"
      >
        Add License →
      </button>
    </div>
  );
}
