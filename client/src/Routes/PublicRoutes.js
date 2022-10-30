import OnlyHeader from "../Default/Layout/OnlyHeader";
import ProfileLayout from "../Default/Layout/ProfileLayout";
import Feedback from "../pages/Feedback";
import Follow from "../pages/Follow";
import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Profile from "../pages/Profile";

export const pubRoutes = [
    {
        path: "/",
        element: Home,
    },
    {
        path: "/following",
        element: Follow,
    },
    {
        path: "/feedback",
        element: Feedback,
        layout: OnlyHeader,
    },
    {
        path: "/upload",
        element: Upload,
        layout: OnlyHeader,
    },
    {
        path: "/profile",
        element: Profile,
        layout: ProfileLayout,
    },
];
