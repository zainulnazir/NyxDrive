import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface LoginParams {
  phone: string;
  code: string;
  password: string;
}

type LoginStep = "phone" | "code" | "password" | "done";

function App() {
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await invoke<string>("telegram_login", {
        phone,
        code: code || "N/A",
        password: password || "N/A"
      });
      
      console.log("Login result:", result);
      setStep("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Login error:", message);
      setError(message);

      if (message.includes("PHONE_CODE")) setStep("code");
      else if (message.includes("PASSWORD")) setStep("password");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component remains the same
}

export default App;