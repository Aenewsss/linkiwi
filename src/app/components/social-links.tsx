"use client";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTelegramPlane, FaTiktok, FaYoutube, FaTwitter, FaLinkedin, FaAmazon, FaShopify } from "react-icons/fa";
import { SiShopee, SiAliexpress } from "react-icons/si";

export const socialLinks = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    whatsapp: FaWhatsapp,
    telegram: FaTelegramPlane,
    tiktok: FaTiktok,
    youtube: FaYoutube,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    amazon: FaAmazon,
    shopee: SiShopee,
    // mercadolivre: SiMercadolivre,
    aliexpress: SiAliexpress,
};

const SocialLinks = () => {
    const [socialLinks, setSocialLinks] = useState([
        { id: "1", platform: "facebook", url: "https://facebook.com" },
        { id: "2", platform: "instagram", url: "https://instagram.com" },
        { id: "3", platform: "telegram", url: "https://t.me" },
        { id: "4", platform: "whatsapp", url: "https://wa.me" },
    ]);

    return (
        <div className="flex justify-center gap-4 mt-4">
            {socialLinks.map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl shadow-md hover:scale-110 transition-transform"
                >
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;