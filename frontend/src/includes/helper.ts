import { Walker } from './../../../src/types';
export default {
    filterWalker: function(walker: Walker[], search: string) : Walker[] {
        if (search == '' || !search || search == null)
            return walker;
        let _walker: Walker[];
        let _search: string = search.trim().toLowerCase();
        let _filter_empty: boolean = _search.indexOf("?") !== -1;
        if (_filter_empty)
            _search = _search.replace('?', '');
        let _search_split: string[] = _search.split(":");
        if (_search_split.length === 1) {
            _walker = walker.filter(function(w){
                let pass: boolean = !_filter_empty;
                if (_filter_empty) {
                    if (w.participates == 1 && w.distance_m == 0)
                        pass = true;
                }
                pass = pass && ((w.firstname+" "+w.lastname).toLowerCase().indexOf(_search) !== -1);

                return pass;
            });
        } else {
            _search = _search_split[1];
            let _class = _search_split[0];
            _walker = walker.filter(function(w) {
                if (w.class.toLowerCase().indexOf(_class) !== -1) {
                    let pass: boolean = !_filter_empty;
                    if (_filter_empty) {
                        if (w.participates == 1 && w.distance_m == 0)
                            pass = true;
                    }
                    pass = pass && ((w.firstname+" "+w.lastname).toLowerCase().indexOf(_search) !== -1);

                    return pass;
                } else
                    return false;
            });
        }
        return _walker;
    },
    animateCSS: function(element: string, animationName: string, callback: () => void) {
        const node: Element | null = document.querySelector(element);
        if (node !== null) {
            node.classList.add('animated', animationName);
            function handleAnimationEnd(): void {
                //@ts-ignore
                node.classList.remove('animated', animationName);
                //@ts-ignore
                node.removeEventListener('animationend', handleAnimationEnd);

                if (typeof callback === 'function') callback()
            }
            node.addEventListener('animationend', handleAnimationEnd);
        }
    }
}