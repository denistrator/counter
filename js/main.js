(function () {
    'use strict';
    var Counter = function (container, variants, params) {
        if (!(this instanceof Counter)) return new Counter(container, variants, params);

        var defaults = {
            minDelay: 0.77,
            maxDelay: 1.11,
            direction: "increase"
        };

        params = params || {};

        for (var def in defaults) {
            if (typeof params[def] === 'undefined' || typeof params[def] === null ||isNaN(params[def])) {
                params[def] = defaults[def];
            }
        }
        var counter = document.querySelector(container);

        if (counter) {
            if (isNaN(counter.innerText)) {
                console.log("Counter has incorrect value");
            }

            var counterDecs = counter.nextElementSibling;
            var minDelay = options.minDelay;
            var maxDelay = options.maxDelay;
            var direction = options.direction;
            var counterInLocStor = localStorage.getItem("counter");
            var arrValues = variants.split(",");

            if (minDelay === undefined || minDelay === undefined || isNaN(minDelay) || isNaN(maxDelay)) {
                minDelay = 2;
                maxDelay = 5;
                direction = "increase";
                console.log("min-delay or max-delay data attr is not set or set incorrect for", counter, "default values were appled");
            }

            if (direction === null || direction === "" ||
                (direction !== "increase" && direction !== "in" &&
                direction !== "decrease" && direction !== "dec")) {
                direction = "increase";
                console.log("direction data attr is not set or set incorrect for", counter, "default value was appled");
            }

            if (counterInLocStor > +counter.innerText &&
                counterInLocStor < +counter.innerText * 1.4) {
                counter.innerText = +localStorage.getItem("counter");
            } //if value in localStorage exists(and fits), apply it in counter

            if (!isNaN(counter.innerText)) {
                updateCounter(counter, minDelay, maxDelay); //2nd, 3rd args are delay in sec
            }

            setMaxWidth(counterDecs, arrValues);
            // find max width for elem based on array of possible values
            window.onresize = function () {
                setMaxWidth(counterDecs, arrValues);
            };
        }

        function setStyle(elem, prop, val) {
            elem.setAttribute("style", prop + ': ' + val);
        }

        function setMaxWidth(elem, values) {
            var maxWidth = 0;
            var initialText = elem.innerText;

            for (var i = values.length - 1; i >= 0; i--) {
                elem.innerText = values[i]; // one by one applying all values from array as innerText
                setStyle(elem, "width", "auto"); // reset current elem width to avoid getting fake "ComputedStyle"
                var currentVal = parseFloat(window.getComputedStyle(elem, null).getPropertyValue("width"));

                if (currentVal > maxWidth) {
                    maxWidth = currentVal;
                }
            }
            elem.innerText = initialText; //return initial elem text (text that was before function call)
            setStyle(elem, "width", maxWidth + "px");
        }

        function updateCounter(elem, minDelay, maxDelay) {
            if (direction === "increase" || direction === "in") {
                elem.innerText = +elem.innerText + 1;
            }
            if (direction === "decrease" || direction === "dec") {
                elem.innerText = +elem.innerText - 1;
            }

            localStorage.setItem("counter", +elem.innerText); // updating localStorage
            counterDecs.innerText = getNumEnding(+elem.innerText, arrValues);

            counter.classList.remove("zero-value");
            if (+elem.innerText === 0) {
                counter.classList.add("zero-value");
            }
            setTimeout(function () {
                updateCounter(elem, minDelay, maxDelay);
            }, (getRandomNum(+minDelay, +maxDelay) * 1000));
        }

        /**
         * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
         * param  iNumber Integer Число на основе которого нужно сформировать окончание
         * param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
         *         например ['яблоко', 'яблока', 'яблок']
         * return String
         */
        function getNumEnding(iNumber, aEndings) {
            var sEnding, i;
            iNumber = Math.abs(iNumber); // for negative numbers
            iNumber = iNumber % 100;
            if (iNumber >= 11 && iNumber <= 19) {
                sEnding = aEndings[2];
            } else {
                i = iNumber % 10;
                switch (i) {
                    case (1):
                        sEnding = aEndings[0];
                        break;
                    case (2):
                    case (3):
                    case (4):
                        sEnding = aEndings[1];
                        break;
                    default:
                        sEnding = aEndings[2];
                }
            }
            return sEnding;
        }

        function getRandomNum(min, max) {
            min = (min > max) ? max : min;
            var rand = min + Math.random() * (max - min);
            rand = rand.toFixed(2);
            return rand;
        }
    };

    window.Counter = Counter;
}());