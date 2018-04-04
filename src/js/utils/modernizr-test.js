import './modernizr';

window.Modernizr.addTest('vrDisplays', function() {
  return typeof window.navigator.getVRDisplays !== 'undefined';
});

export default function modernizrTest(tests) {
  return tests.find(test => {
    return !window.Modernizr[test];
  });
}
