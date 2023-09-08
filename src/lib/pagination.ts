export function getPaginationItems(
    currentPage: number,
    lastPage: number,
    maxLength: number
) {
    const res: Array<number> = [];
    if (lastPage <= maxLength) {

        for (let i = 1; i <= lastPage; i++) {
            res.push(i);
        }

    } else {
        const startPage = 1;
        const availablePages = 3;
        const maximumLength = maxLength - availablePages;
        const sLength = maximumLength / 2;

        if (
            currentPage - startPage < sLength ||
            lastPage - currentPage < sLength
        ) {
            if (currentPage !== lastPage) {

                for (let j = 1; j <= sLength + startPage + 1; j++) {
                    res.push(j);
                }
            } else {

                for (let j = 1; j <= sLength + startPage - 1; j++) {
                    res.push(j);
                }
            }
            res.push(NaN);
            if (currentPage === lastPage) {

                for (let k = lastPage - sLength - 1; k <= lastPage; k++) {
                    res.push(k);
                }
            } else {

                for (let k = lastPage - sLength + 1; k <= lastPage; k++) {
                    res.push(k);
                }
            }

        } else if (
            currentPage - startPage >= maximumLength &&
            lastPage - currentPage >= maximumLength
        ) {
            const maximumLength = sLength - 1;
            res.push(1);
            res.push(NaN);

            for (
                let l = currentPage - maximumLength;
                l <= currentPage + maximumLength;
                l++
            ) {
                res.push(l);
            }

            res.push(NaN);
            res.push(lastPage);

        } else {
            const nearTheFirst = currentPage - startPage < lastPage - currentPage;
            let length = maxLength;

            if (nearTheFirst) {

                for (let m = 1; m <= currentPage + 1; m++) {
                    res.push(m);
                    length -= 1;
                }

                res.push(NaN);
                length -= 1;

                for (let n = lastPage - (length - 1); n <= lastPage; n++) {
                    res.push(n);
                }

            } else {

                for (let o = lastPage; o >= currentPage - 1; o--) {
                    res.unshift(o);
                    length -= 1;
                }

                res.unshift(NaN);
                length -= 1;

                for (let p = length; p >= 1; p--) {
                    res.unshift(p);
                }
            }
        }
    }

    return res;
}
