var Splitter = function() {

    var dirty = false;
    var len = 0;

    var solution = [];

    // Contains the name-amount pairs of participants.
    this.contributions = {};
    
    // Add a contributor.
    this.add = function(name, amount) {
        if (!this.contributions.hasOwnProperty(name)) {
            this.contributions[name] = 0.0;
        }
        this.contributions[name] += amount;
        len++;
        dirty = true;
    };

    // Remove a contributor.
    this.remove = function(name) {
        delete this.contributions[name];
        len--;
        dirty = true;
    }

    // Get the current solution.
    // The solution is a list of 3-tuples, each of the form [from, to, amount]
    this.get = function() {
        if (!dirty) {
            return solution;
        }
        solution = [];

        var sep = getSeparatedContributions(this);
        var pos = sep[0];
        var neg = sep[1];

        pos = getSortedContributions(pos);
        neg = getSortedContributions(neg);

        var currentTaker = pos.pop();
        var currentGiver = neg.pop();
        while (currentTaker !== undefined && currentGiver !== undefined) {
            var drName = currentTaker[0];
            var crName = currentGiver[0];

            var drAmt = currentTaker[1];
            var crAmt = currentGiver[1];

            console.log(currentTaker);
            console.log(currentGiver);

            var amt = 0.0;
            if (drAmt < crAmt) {
                amt = drAmt;
                currentGiver[1] -= drAmt;
                currentTaker = pos.pop();
            } else if (drAmt > crAmt) {
                amt = crAmt;
                currentTaker[1] -= crAmt;
                currentGiver = neg.pop();
            } else {
                // equal
                amt = crAmt;
                currentTaker = pos.pop();
                currentTaker = pos.pop();
            }
            solution.push([crName, drName, amt]);
        }
        dirty = false;
        return solution;
    };

    this.addAll = function(contribs) {
        for (var i = 0; i < contribs.length; ++i) {
            var contrib = contribs[i];
            this.add(contrib.name, contrib.amount);
        }
    };

    this.clear = function() {
        this.contributions = {};
    };

    // Get the per-person share.
    this.getShare = function() {
        var sum = 0.0;
        if (len === 0) {
            return 0;
        }
        for (var i in this.contributions) {
            if (this.contributions.hasOwnProperty(i)) {
                sum += this.contributions[i];
            }
        }
        return sum / len;
    };

    this.test = function() {
        return getSeparatedContributions(this);
    };

    // Adjust the contributions by deducting each person's share from their
    // contributions. In the end, people who get money will have positive
    // balances and those who owe money will have negative balances.
    var getAdjustedContributions = function(splitter) {
        var share = splitter.getShare();
        var ret = {};
        for (var i in splitter.contributions) {
            if (splitter.contributions.hasOwnProperty(i)) {
                ret[i] = splitter.contributions[i] - share;
            }
        }
        return ret;
    };

    // Separate people with positive and negative balances. The returned list
    // contains two objects, the first one being the people who are owed money
    // and the second being people who owe money. The balances in the second
    // list are positive, indicating the amount of money owed.
    var getSeparatedContributions = function(splitter) {
        var adj = getAdjustedContributions(splitter);
        var pos = {};
        var neg = {};
        for (var i in adj) {
            if (adj.hasOwnProperty(i)) {
                // Deliberately leave out people with zero balance.
                var bal = adj[i];
                if (bal > 0) {
                    pos[i] = bal;
                } else if (bal < 0) {
                    neg[i] = -bal;  // Make it positive.
                }
            }
        }
        return [pos, neg];
    };

    // Given an *object* of contributions, returns a *list of 2-lists*, sorted
    // ascending by amount.
    var getSortedContributions = function(contribs) {
        var ret = [];
        for (var i in contribs) {
            if (contribs.hasOwnProperty(i)) {
                ret.push([i, contribs[i]]);
            }
        }
        ret.sort(function(a, b) {
            return a[1] < b[1];
        });
        return ret;
    };
};

