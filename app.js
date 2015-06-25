(function() {
    var all = document.getElementById('all');
    var ctr = 0;

    var splitter = new Splitter();
    
    var addBlank = function() {
        addNew('', 0.0);
    };

    var addNew = function(sname, iamt) {
        var d = document.createElement('div');
        d.classList.add('details');
        d.classList.add('form-inline');


        var name = document.createElement('input');
        name.type = 'text';
        name.classList.add('name');
        name.classList.add('form-control');
        name.placeholder = 'name';
        name.value = sname;
        //name.onkeyup = update;

        var amount = document.createElement('input');
        amount.type = 'text';
        amount.classList.add('amount');
        amount.classList.add('form-control');
        amount.placeholder = 'amount';
        amount.value = iamt;
        //amount.onkeyup = update;

        d.appendChild(name);
        d.appendChild(amount);

        all.appendChild(d);

    };

    var update = function(el) {
        var name = this.parentElement.getElementsByClassName('name')[0].value;
        var amountEl = this.parentElement.getElementsByClassName('amount')[0];
        var amt = parseFloat(amountEl.value);
        splitter.clear();
        splitter.addAll(getContribs());
        showResult();
    };

    var init = function() {
        var data = localStorage.getItem('contribs');
        if (data) {
            d = JSON.parse(data);
            for (var key in d) {
                addNew(key, d[key]);                     
            }
        } else {
            // Add two boxes.
            addBlank();
            addBlank();
        }
    };

    var destroy = function() {
        localStorage.setItem('contribs', JSON.stringify(getContribs()));
    };

    var getContribs = function() {
        var contribEls = document.getElementsByClassName('details');
        var contribs = [];
        for (var i = 0; i < contribEls.length; ++i) {
            var name = contribEls[i].getElementsByClassName('name')[0].value;
            var amt  = contribEls[i].getElementsByClassName('amount')[0].value;
            var amtFloat = parseFloat(amt);
            if (isNaN(amtFloat) || !isFinite(amtFloat)) {
                console.log('Ignoring [' + i + ']' + name);
                continue;
            }
            contribs.push({name: name, amount: amtFloat});
        }
        return contribs;
    };

    var showResult = function() {
        var resultArea = document.getElementById('result');
        resultArea.innerHTML = '';
        var solution = splitter.get();
        for (var i = 0; i < solution.length; ++i) {
            var el = document.createElement('div');
            el.className = 'resultline';
            el.innerHTML = reprSolution(solution);
            console.log(reprSolution(solution));
            resultArea.appendChild(el);
        }
    };

    var reprSolution = function(tup) {
        return tup[0] + ' give ' + tup[1] + ' ' + tup[2];
    };

    document.onunload = function() {
        destroy();
    };

    init();
    var addNewButton = document.getElementById('new');
    addNewButton.addEventListener('click', addBlank);

    document.getElementById('compute').addEventListener('click', function() {
        var contribs = getContribs();
        console.log(contribs);
        var splitter = new Splitter();
        splitter.addAll(contribs);

        var resultArea = document.getElementById('result');
        resultArea.innerHTML = '';

        var head = document.createElement('div');
        head.className = 'share';
        head.innerHTML = 'Share per person: ' + splitter.getShare();
        resultArea.appendChild(head);
        
        var solution = splitter.get();
        for (var i = 0; i < solution.length; ++i) {
            var el = document.createElement('div');
            el.className = 'resultline';
            el.innerHTML = reprSolution(solution[i]);
            console.log(reprSolution(solution));
            resultArea.appendChild(el);
        }
    });
})();
