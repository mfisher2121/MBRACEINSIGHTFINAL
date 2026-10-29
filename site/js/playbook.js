// Playbook merge fields. Fill from the URL so n8n (or a hand-built link) can personalize:
//   /playbooks/quote-follow-up.html?company=Acme%20Heating&date=2026-11-02
// Missing values fall back to neutral text, never to another company's name.
(function () {
  var q = new URLSearchParams(location.search);
  var company = (q.get('company') || '').trim();
  var dateParam = (q.get('date') || '').trim();
  var start = dateParam ? new Date(dateParam + 'T12:00:00') : new Date();
  if (isNaN(start)) start = new Date();
  var fmt = function (d, opts) { return d.toLocaleDateString('en-US', opts || { month: 'long', day: 'numeric', year: 'numeric' }); };

  document.querySelectorAll('[data-merge=company]').forEach(function (el) {
    el.textContent = company || el.getAttribute('data-fallback') || 'your company';
  });
  document.querySelectorAll('[data-merge=prepared]').forEach(function (el) {
    el.textContent = company ? 'Prepared for ' + company + ' · ' + fmt(start, { month: 'long', year: 'numeric' }) : 'MBRACE Insight playbook · ' + fmt(start, { month: 'long', year: 'numeric' });
  });
  if (company) document.title = document.title + ' · ' + company;

  // Calendar rows: data-week="1" data-day="0|2|4" become real dates starting the Monday on or after `date`.
  var monday = new Date(start);
  monday.setDate(monday.getDate() + ((8 - monday.getDay()) % 7));
  document.querySelectorAll('[data-week]').forEach(function (el) {
    var d = new Date(monday);
    d.setDate(d.getDate() + (+el.getAttribute('data-week') - 1) * 7 + (+el.getAttribute('data-day') || 0));
    el.textContent = fmt(d, { weekday: 'short', month: 'short', day: 'numeric' });
  });

  var btn = document.getElementById('print');
  if (btn) btn.addEventListener('click', function () { window.print(); });
})();
