"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BusinessHealthData } from "../types/buisnessHealthTypes";

export function useBusinessHealth(email?: string) {
  const [data, setData] = useState<BusinessHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axios
      .get("/api/health/summary", { params: { email } })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [email]);

  return { data, loading };
}
