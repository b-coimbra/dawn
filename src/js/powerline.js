class Powerline {
  refs = {
    panels: '#panels > ul',
    tabs: '#tabs ul li',
    indicator: '.indicator'
  };

  constructor() {
    let panels = $(this.refs.panels).length;

    for (let i = 0; i <= panels; $(this.refs.indicator).innerHTML += `<li tab-index=${i++} ${i == 1 ? 'active' : ''}></li>`);

    $('.indicator li').forEach(elem => {
      elem.onclick = ({ target }) => {
        this.activateByKey(Number(target.getAttribute('tab-index')) + 1);
      }
    })

    document.onkeydown = (e) => {
      if (e != undefined) {
        let key = e.key;

        if (Number.isInteger(parseInt(key)) && key <= panels)
          this.activateByKey(key)
      }
    };

    setInterval(() => { $('.time').innerHTML = `${strftime('H')}<span>:${strftime('i')}</span>`; }, 1000);
  }

  activateByKey(key) {
    this.activate(this.refs.tabs, `${this.refs.tabs}:nth-child(${key})`);
    this.activate(this.refs.panels, `${this.refs.panels}:nth-child(${key})`);
  }

  activate(obj, item) {
    $(obj).forEach((i) => i.removeAttribute('active'));
    $(item).setAttribute('active', '');
  };
}
