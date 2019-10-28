import * as React from "react";
import Head from "next/head";
import { NextPage } from "next";
import Iframe from "../components/Iframe";

const defaultUrl = "https://shaun.church";
// const url = "https://guardian.com";
// const url = "https://smashingmagazine.com";

interface Size {
  name: string;
  width: number;
  height: number;
}

const sizes: Size[] = [
  { name: "one", width: 320, height: 640 },
  { name: "two", width: 400, height: 758 },
  { name: "three", width: 768, height: 1024 },
  { name: "four", width: 1024, height: 800 }
];

const Home: NextPage = () => {
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);
  const [masterFrame, setMasterFrame] = React.useState<string>("one");
  const [url, setUrl] = React.useState<string>(defaultUrl);

  React.useEffect(() => {
    let newUrl = window.localStorage.getItem("url");
    setUrl(newUrl || defaultUrl);
  }, []);

  const handleFrameScroll = (scrollPosition: number, name: string) => {
    console.log("scrol");
    if (masterFrame == name) {
      setScrollPosition(scrollPosition);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    window.localStorage.setItem("url", url);
    e.preventDefault();
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  };

  return (
    <div>
      <Head>
        <title>Breakframes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit} style={{ background: "#222" }}>
        <input
          style={{
            background: "#222",
            color: "#ccc  ",
            border: "1px solid #666",
            borderRadius: "3px",
            padding: "10px",
            margin: "10px",
            width: "500px",
            fontSize: "16px"
          }}
          type="text"
          name="url"
          onChange={handleChange}
          value={url}
        />
      </form>

      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#222"
        }}
      >
        {sizes.map(frame => (
          <Iframe
            key={frame.name}
            src={url}
            width={frame.width}
            height={frame.height}
            onScroll={handleFrameScroll}
            onActive={(name: string) => setMasterFrame(name)}
            scrollPosition={scrollPosition}
            masterFrame={masterFrame}
            name={frame.name}
          />
        ))}
      </main>
      <pre>
        {masterFrame} {scrollPosition}
      </pre>
      <main style={{ display: "flex", background: "#222" }}>
        {/* <Iframe src={url} width={1280} height={640} /> */}
      </main>
      <style jsx global>{`
        *,
        *:after,
        *:before {
          box-sizing: border-box;
        }

        html,
        body,
        #__next {
          display: flex;
          min-height: 100%;
          min-width: 100%;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }

        a {
          color: #067df7;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default Home;
