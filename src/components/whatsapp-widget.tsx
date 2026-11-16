"use client";

import {useEffect, useState} from "react";
import {contactDetails} from "@/data/site";
import {WhatsAppIcon} from "@/components/whatsapp-icon";

const message = "Hello! I'm interested in booking a safari. Can you help me?";
const whatsappUrl = `${contactDetails.whatsapp}?text=${encodeURIComponent(message)}`;

export function WhatsAppWidget() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setShowPrompt(true), 800);
    const hideTimer = window.setTimeout(() => setShowPrompt(false), 7000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return <aside className="whatsapp-widget" aria-label="WhatsApp chat">
    <a className={`whatsapp-widget__prompt ${showPrompt ? "is-visible" : ""}`} href={whatsappUrl} target="_blank" rel="noreferrer">
      <span aria-hidden="true">💬</span> Chat with us
    </a>
    <a className="whatsapp-widget__fab" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with Golden Dream Safaris on WhatsApp">
      <WhatsAppIcon/>
    </a>
  </aside>;
}
