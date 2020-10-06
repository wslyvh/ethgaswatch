import React from 'react';

function Privacy() {
  return (
    <div className="mb-4">
      <h2>Privacy Policy</h2>
      <small>Last updated: Oct 2020</small>
      <p className="mt-4 mb-2">
        A more detailed, in-depth privacy policy will come soon. In the meantime:
      </p>
      <ul className="list-group text-left">
        <li>this website uses no cookies</li>
        <li>this website uses Clicky (https://clicky.com/) website analytics, a privacy-friendly alternative to Google analytics.
          By default, no "personal data" of visitors is monitored by this service. This means all IP addresses are anonymized, and global <a href="https://clicky.com/optout">opt out</a> cookies are honored</li>
        <li>this website does not collect anu personal information from its visitors, unless you sign up for alerts. In that case, your email address is stored in our cloud-hosted database (Azure, West Europe)</li>
        <li>your email address will not be sold, shared with any other parties or used for purposed beyond gas prices alerts and occassional information regarding ETH Gas.watch</li>
        <li>if you have any further questions, please don't hesitate to reach out to me at wesley [at] ethgas.watch</li>
      </ul>
    </div>
  );
}

export default Privacy;
