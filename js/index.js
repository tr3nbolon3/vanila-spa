Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this);
});

const getFormData = (formDataObject) => {
  const dataArr = [...formDataObject];
  const keys = dataArr.map(([key]) => key);
  const values = dataArr.map(([, value]) => value);

  const resultObject = keys.reduce((acc, key, i) => ({ ...acc, [key]: values[i] }), {});
  return resultObject;
};

const app = () => {
  const defaultState = {
    screan: 'first',
    firstname: '',
    lastname: '',
    birthday: '',
    email: '',
    country: '',
    city: '',
  };

  const stateData = window.localStorage.getItem('state') || JSON.stringify(defaultState);
  let state = JSON.parse(stateData);
  
  const dispatch = (renderFunc, data = {}) => {
    state = { ...state, ...data };
    renderFunc(root, state);
  };

  const root = document.getElementById('app');
  const getTemplate = (templateName) => document.getElementById(templateName).innerHTML;

  const firstFormTemplate   = Handlebars.compile(getTemplate('firstForm'));
  const secondFormTemplate  = Handlebars.compile(getTemplate('secondForm'));
  const resultTableTemplate = Handlebars.compile(getTemplate('resultTable'));
  
  const renderResultTable = (mountElement, state) => {
    mountElement.innerHTML = resultTableTemplate({ state });

    const backBtn = mountElement.querySelector('.app-back-button');
    backBtn.addEventListener('click', () => {
      dispatch(renderSecondForm, { screan: 'second' });
    });
  };

  const renderSecondForm = (mountElement, state) => {
    const countries = ['США', 'Россия', 'Китай', 'Таиланд', 'Сирия', 'Украина'];
    mountElement.innerHTML = secondFormTemplate({ state, countries });

    const form = mountElement.querySelector('.app-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const { target } = event;
      const formData = getFormData(new FormData(target));
      dispatch(renderResultTable, { screan: 'result', ...formData });
    });

    const backBtn = mountElement.querySelector('.app-back-button');
    backBtn.addEventListener('click', () => {
      const formData = getFormData(new FormData(form));
      dispatch(renderFirstForm, { screan: 'first', ...formData });
    });
  };

  const renderFirstForm = (mountElement, state) => {
    mountElement.innerHTML = firstFormTemplate({ state });

    const form = mountElement.querySelector('.app-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const { target } = event;
      const formData = getFormData(new FormData(target));
      dispatch(renderSecondForm, { screan: 'second', ...formData });
    });
  };

  const renderesMap = {
    'first' : renderFirstForm,
    'second': renderSecondForm,
    'result': renderResultTable,
  };

  renderesMap[state.screan](root, state);
  window.addEventListener('beforeunload', () => {
    window.localStorage.setItem('state', JSON.stringify(state));
  });
};

app();
