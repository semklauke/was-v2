import { Walker } from './../../../src/types';
export default {
    filterWalker: function(walker: Walker[], search: string) : Walker[] {
        if (search == '' || search === '' || !search || search == null)
            return walker;
        let _walker: Walker[];
        let _search: string = search.trim().toLowerCase();
        let _search_split: string[] = _search.split(":");
        if (_search_split.length === 1) {
            _walker = walker.filter(function(w){
                let name = (w.firstname+" "+w.lastname).toLowerCase();
                if (name.indexOf(_search) !== -1)
                    return w;
            });
        } else {
            _search = _search_split[1];
            let _class = _search_split[0];
            _walker = walker.filter(function(w) {
                if (w.class.toLowerCase().indexOf(_class) !== -1) {
                    let name = (w.firstname+" "+w.lastname).toLowerCase();
                    if (name.indexOf(_search) !== -1)
                        return w;
                } 
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
// export default {
//         filterWalker: function(walker, search) {
//         if (search == '' || search === '' || !search || search == null)
//             return walker;
//         let _walker;
//         let _search = search.trim().toLowerCase();
//         let _search_split = _search.split(":");
//         if (_search_split.length === 1) {
//             _walker = walker.filter(function(w){
//                 let name = (w.firstname+" "+w.lastname).toLowerCase();
//                 if (name.indexOf(_search) !== -1)
//                     return w;
//             });
//         } else {
//             _search = _search_split[1];
//             let _class = _search_split[0];
//             _walker = walker.filter(function(w) {
//                 if (w.class.toLowerCase().indexOf(_class) !== -1) {
//                     let name = (w.firstname+" "+w.lastname).toLowerCase();
//                     if (name.indexOf(_search) !== -1)
//                         return w;
//                 } 
//             });
//         }
//         return _walker;
//     }
// }