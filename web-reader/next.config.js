/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

const nextConfig = {};

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
