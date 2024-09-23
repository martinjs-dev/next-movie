/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects(){
        return [
            {
                source: "/",
                destination: "/movies",
                permanent: true
            },
        ];
    },
};

module.exports = nextConfig;
