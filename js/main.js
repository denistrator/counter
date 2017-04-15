(function () {
    'use strict';
    var Counter = function (container, variants, params) {
        if (!(this instanceof Counter)) return new Counter(container, variants, params);

        var self = this;
        self.counter = document.querySelector(container);

        if (!self.counter) {
            console.log("Can not find your counter. Check container:", "\""+container+"\"");
            return;
        }
        if (isNaN(self.counter.innerText)) {
            console.log("Counter has incorrect value");
            self.counter.innerText = 0;
        }

        var defaults = {
            minDelay: 0.77,
            maxDelay: 1.11,
            backwards: false
        };

        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined' || typeof params[def] === null || isNaN(params[def])) {
                params[def] = defaults[def];
            }
        }
        self.params = params;


        var counterDecs = self.counter.nextElementSibling;
        var counterInLocStor = localStorage.getItem("counter");
        var arrValues = variants.split(",");

        if (counterInLocStor > +self.counter.innerText &&
            counterInLocStor < +self.counter.innerText * 1.4) {
            self.counter.innerText = +localStorage.getItem("counter");
        } //if value in localStorage exists(and fits), apply it in counter

        if (!isNaN(self.counter.innerText)) {
            updateCounter(self.counter, self.params.minDelay, self.params.maxDelay); //2nd, 3rd args are delay in sec
        }

        setMaxWidth(counterDecs, arrValues);
        // find max width for elem based on array of possible values
        window.onresize = function () {
            setMaxWidth(counterDecs, arrValues);
        };


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
            // console.log(minDelay);
            // console.log(maxDelay);
            if (self.params.backwards) {
                elem.innerText = +elem.innerText - 1;
            } else {
                elem.innerText = +elem.innerText + 1;
            }

            localStorage.setItem("counter", +elem.innerText); // updating localStorage
            counterDecs.innerText = getNumEnding(+elem.innerText, arrValues);

            self.counter.classList.remove("zero-value");
            if (+elem.innerText === 0) {
                self.counter.classList.add("zero-value");
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
