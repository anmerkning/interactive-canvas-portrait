import Button from "./components/button";
import Pug from "./components/pug";

const App = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="relative w-full h-full grid grid-cols-2">
        <div className="flex justify-end items-center bg-light-default pr-8">
          <div className="max-w-96 text-dark-950">
            <h1 className="font-heading text-7xl">Anmer Seif</h1>
            <h2 className="font-subheading text-4xl leading-12 mt-6">
              Data Engineer
            </h2>
            <p className="font-text mt-6">
              Experienced in front-end and back-end development (JavaScript,
              Typescript, React, Node.js, C#, .Net, Rust, C++).
            </p>
            <Button
              href="https://github.com/anmerkning?tab=repositories"
              color="cta"
              size="large"
            >
              Projects
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-start bg-light-secondary-default pl-8">
          <Pug />
        </div>
      </div>
    </div>
  );
};

export default App;
