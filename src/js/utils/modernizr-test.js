import './modernizr';

export default function modernizrTest(tests) {
  return tests.find(test => {
    return !window.Modernizr[test];
  });
}
