import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/prescription/:id', 'routes/prescription.tsx'),
    route('/how-it-works', 'routes/how-it-works.tsx'),
    route('/reminders', 'routes/reminders.tsx'),
    route('/report', 'routes/report.tsx'),
    route('/chat', 'routes/chat.tsx'),
    route('/lifestyle', 'routes/lifestyle.tsx'),
    route('/settings', 'routes/settings.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;
