import keyboard from "../assets/image/header/keyboard.svg";
import lang from "../assets/image/header/lang.svg";
import question from "../assets/image/header/question.svg";
import profile from "../assets/image/header/profile.svg";
import coin from "../assets/image/header/coin.svg";
import setting from "../assets/image/header/setting.svg";

import difference from "../assets/image/sidebar/difference.svg";
import music from "../assets/image/sidebar/music.svg";

import { Follow, Home } from "../assets/image/sidebar/SideBarIcon";
import profile_share from "../assets/image/profile/profile_share.svg";

import VideoGallery from "../components/VideoGallery";
import PhotoGallery from "../components/PhotoGallery";
import SharedGallery from "../components/SharedGallery";

export const END_POINT_API = "https://630b16fbed18e825164db3b3.mockapi.io/api/tiktok/";
export const END_POINT_API2 = "http://localhost:5000/api";

export const MENU_SETTING = [
    {
        option: "English",
        icon: lang,
        sub_menu: {
            title: "Language",
            list: [
                {
                    option: "English",
                    to: "/",
                    href: "",
                },
                {
                    option: "العربية",
                    to: "/",
                    href: "",
                },
                {
                    option: "বাঙ্গালি (ভারত)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Cebuano (Pilipinas)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Čeština (Česká republika)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Deutsch",
                    to: "/",
                    href: "",
                },
                {
                    option: "Ελληνικά (Ελλάδα)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Suomi (Suomi)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Français",
                    to: "/",
                    href: "",
                },
                {
                    option: "Suomi (Suomi)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Filipino (Pilipinas)",
                    to: "/",
                    href: "",
                },
                {
                    option: "עברית (ישראל)",
                    to: "/",
                    href: "",
                },
                {
                    option: "हिंदी",
                    to: "/",
                    href: "",
                },
                {
                    option: "Magyar (Magyarország)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Bahasa Indonesia (Indonesia)",
                    to: "/",
                    href: "",
                },
                {
                    option: "Italiano (Italia)",
                    to: "/",
                    href: "",
                },
                {
                    option: "日本語（日本）",
                    to: "/",
                    href: "",
                },
                {
                    option: "မြန်မာ (မြန်မာ)",
                    to: "/",
                    href: "",
                },
            ],
        },
    },
    {
        option: "Feedback and help",
        href: "",
        icon: question,
        to: "/feedback",
    },
    {
        option: "Keyboard shortcuts",
        href: "",
        icon: keyboard,
        to: "/",
    },
];

export const MENU_SETTING_USER = [
    {
        option: "View Profile",
        href: "",
        icon: profile,
        to: "/profile",
    },
    {
        option: "Get coins",
        href: "",
        icon: coin,
        to: "/",
    },
    {
        option: "Settings",
        href: "",
        icon: setting,
        to: "/",
    },
];

export const MAIN_NAV_SIDEBAR = [
    {
        title: "For You",
        icon: Home,
    },
    {
        title: "Following",
        icon: Follow,
    },
    // {
    //     title: "LIVE",
    //     icon: Live
    // }
];

export const DICOVER_SECTION = [
    {
        title: "suthatla",
        icon: difference,
    },
    {
        title: "mackedoi",
        icon: difference,
    },
    {
        title: "sansangthaydoi",
        icon: difference,
    },
    {
        title: "Yêu Đơn Phương Là Gì (MEE Remix) - Mee Media & h0n",
        icon: music,
    },
    {
        title: "Nghe lời mẹ ru - NSND Bạch Tuyết & Hứa Kim Tuyền",
        icon: music,
    },
    {
        title: "Thiên Thần Tình Yêu - RICKY STAR",
        icon: music,
    },
    {
        title: "7749hieuung",
        icon: difference,
    },
    {
        title: "genzlife",
        icon: difference,
    },
    {
        title: "Tình Đã Đầy Một Tim - Huyền Tâm Môn",
        icon: music,
    },
    {
        title: "Thằng Hầu (Thái Hoàng Remix) [Short Version] - Dunghoangpham",
        icon: music,
    },
];

export const FOOTER = [
    [
        {
            title: "About",
            href: "",
            to: "",
        },
        {
            title: "Tiktok Browse",
            href: "",
            to: "",
        },
        {
            title: "Newsroom",
            href: "",
            to: "",
        },
        {
            title: "Contact",
            href: "",
            to: "",
        },
        {
            title: "Careers",
            href: "",
            to: "",
        },
        {
            title: "ByteDance",
            href: "",
            to: "",
        },
    ],
    [
        {
            title: "TikTok for Good",
            href: "",
            to: "",
        },
        {
            title: "Advertise",
            href: "",
            to: "",
        },
        {
            title: "Developers",
            href: "",
            to: "",
        },
        {
            title: "Transparency",
            href: "",
            to: "",
        },
        {
            title: "TikTok Rewards",
            href: "",
            to: "",
        },
    ],
    [
        {
            title: "Help",
            href: "",
            to: "",
        },
        {
            title: "Safety",
            href: "",
            to: "",
        },
        {
            title: "Terms",
            href: "",
            to: "",
        },
        {
            title: "Privacy",
            href: "",
            to: "",
        },
        {
            title: "Creator Portal",
            href: "",
            to: "",
        },
        {
            title: "Community Guidelines",
            href: "",
            to: "",
        },
    ],
];

export const PROFILE_TABS = [
    {
        name: "Photos",
        content: PhotoGallery,
    },
    {
        name: "Videos",
        content: VideoGallery,
    },
    {
        name: "Shared",
        icon: profile_share,
        content: SharedGallery,
    },
];

export const convert_milions = (number) => {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1000000) {
        return number / 1000 + "K";
    } else {
        return number / 1000000 + "M";
    }
};
