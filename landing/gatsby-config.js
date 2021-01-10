module.exports = {
  siteMetadata: {
    title: "Kord",
    description: "All your music, in one place.",
    author: "@Bundit"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/assets`
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Kord Player",
        short_name: "Kord",
        start_url: "/app/library",
        background_color: "#ffbb11",
        theme_color: "#000000",
        display: "standalone",
        icon: "src/assets/favicon.png"
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.svg$/ // See below to configure properly
        }
      }
    },
    "gatsby-plugin-layout",
    "gatsby-plugin-offline"
  ],
  proxy: {
    prefix: "/auth",
    url: "http://localhost:8888"
  }
};
