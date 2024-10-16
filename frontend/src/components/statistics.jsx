import React, { useEffect } from 'react';

const Statistics = () => {
  useEffect(() => {
    const numbers = document.querySelectorAll("[countTo]");

    numbers.forEach((number) => {
      const ID = number.getAttribute("id");
      const value = number.getAttribute("countTo");
      const countUp = new CountUp(ID, value);

      if (number.hasAttribute("data-decimal")) {
        const options = {
          decimalPlaces: 1,
        };
        countUp.start();
      } else {
        countUp.start();
      }

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
        number.innerHTML = value;
      }
    });
  }, []);

  return (
    <div className="container flex flex-col mx-auto bg-white">
      <div className="w-full draggable">
        <div className="container flex flex-col items-center gap-16 mx-auto my-32">
          <div className="grid w-full grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-y-8">
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold leading-tight text-center text-dark-grey-900">
                <span id="countto1" countTo="250">+</span>
              </h3>
              <p className="text-base font-medium leading-7 text-center text-dark-grey-600">
                Successful Projects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold leading-tight text-center text-dark-grey-900">
                $<span id="countto2" countTo="12">m</span>
              </h3>
              <p className="text-base font-medium leading-7 text-center text-dark-grey-600">
                Annual Revenue Growth
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold leading-tight text-center text-dark-grey-900">
                <span id="countto3" countTo="2600" data-decimal="1">k+</span>
              </h3>
              <p className="text-base font-medium leading-7 text-center text-dark-grey-600">
                Global Partners
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold leading-tight text-center text-dark-grey-900">
                <span id="countto4" countTo="18000">+</span>
              </h3>
              <p className="text-base font-medium leading-7 text-center text-dark-grey-600">
                Daily Website Visitors
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Statistics;
