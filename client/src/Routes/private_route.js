/**
 * layout == null => <></>
 * layout == undefined => DefaultLayout
 * layout == abc => <abc></abc>
 */
export const priRoutes = [
  {
    path: "/",
    element: "Home",
  },
  {
    path: "/following",
    element: "Follow",
  },
  {
    path: "/feedback",
    element: "Feedback",
    layout: "OnlyHeader",
  },
  {
    path: "/upload",
    element: "Upload",
    layout: "null",
  },
];
