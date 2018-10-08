$(() => {
  let element = document.getElementById('status');
  element.innerHTML = 'All Systems Online';
  $('#status').addClass('green');

  element = document.getElementById('today');
  let today = new Date().toString();
  today = today.split(' ').splice(1, 3);
  element.innerHTML = `Today, ${today.join(' ')} (GMT)`;
});

let sp = new StatusPage.page({ page : 'srhpyqt94yxb' });
sp.summary({
  success : (data) => {
    let components = data.components.filter(component => /(API|Gateway|CloudFlare|Media Proxy)/i.test(component.name));
    for (let component of components) document.getElementById(`discord:${component.name.toLowerCase().replace(/ /g, '-')}`).innerHTML = component.status.charAt(0).toUpperCase() + component.status.substr(1).toLowerCase();
  }
});

$.ajax({
  url: 'https://discordbots.org/api/bots/267035345537728512/status',
  dataType: 'json',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });

    let element = document.getElementById('bastion:bot');
    element.innerHTML = 'Service Unavailable';
    element.setAttribute('style', 'color: #DD0000');

    element = document.getElementById('status');
    element.innerHTML = 'Major Service Outage';
    $('#status').addClass('orange');
    $('#status').removeClass('green yellow');
  },
  success: (bastion) => {
    let element = document.getElementById('bastion:bot');
    element.innerHTML = bastion.status.charAt(0).toUpperCase() + bastion.status.substr(1).toLowerCase();
    if (element.innerHTML.toLowerCase() === 'offline') {
      element.setAttribute('style', 'color: #DD0000');

      element = document.getElementById('status');
      element.innerHTML = 'Major Service Outage';
      $('#status').addClass('orange');
      $('#status').removeClass('green yellow');
    }
    else {
      element.setAttribute('style', 'color: #71BF60');
    }
  }
});

$.ajax({
  url: 'https://discordapp.com/api/guilds/267022940967665664/embed.json',
  dataType: 'json',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });

    let element = document.getElementById('bastion:guild');
    element.innerHTML = 'Service Unavailable';
    element.setAttribute('style', 'color: #DD0000');

    element = document.getElementById('status');
    element.innerHTML = 'Major Service Outage';
    $('#status').addClass('orange');
    $('#status').removeClass('green yellow');
  },
  success: (guild) => {
    let element = document.getElementById('bastion:guild');
    element.innerHTML = 'Online';
    element.setAttribute('style', 'color: #71BF60');
  }
});

$.ajax({
  url: 'https://bastionbot.org',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });

    let element = document.getElementById('bastion:website');
    element.innerHTML = 'Service Unavailable';
    element.setAttribute('style', 'color: #DD0000');

    element = document.getElementById('status');
    element.innerHTML = 'Major Service Outage';
    $('#status').addClass('orange');
    $('#status').removeClass('green yellow');
  },
  statusCode: {
    200: () => {
      let element = document.getElementById('bastion:website');
      element.innerHTML = 'Online';
      element.setAttribute('style', 'color: #71BF60');
    }
  }
});

$.ajax({
  url: 'https://docs.bastionbot.org',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });

    let element = document.getElementById('bastion:docs');
    element.innerHTML = 'Service Unavailable';
    element.setAttribute('style', 'color: #DD0000');

    element = document.getElementById('status');
    element.innerHTML = 'Major Service Outage';
    $('#status').addClass('orange');
    $('#status').removeClass('green yellow');
  },
  statusCode: {
    200: () => {
      let element = document.getElementById('bastion:docs');
      element.innerHTML = 'Online';
      element.setAttribute('style', 'color: #71BF60');
    }
  }
});

$.ajax({
  url: '/history/incidents.json',
  dataType: 'json',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });
  },
  success: (incidents) => {
    let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];
    let date = new Date();

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let month = months[monthIndex];
    let year = date.getFullYear();

    let incidentsToday = incidents[`${day}${monthIndex + 1}${year}`];

    if (incidentsToday) {
      document.getElementById('noIncidents').setAttribute('hidden', true);

      let element = document.getElementById('incidentsToday');
      let outage = false;

      for (let i = 0; i < incidentsToday.length; i++) {
        element.insertAdjacentHTML('beforeend',
          `<div id="incident-${i}" class="incident">
            <div class="incident-title">${incidentsToday[i].title}</div>
            <div class="incident-resolve-status">${incidentsToday[i].resolved ? `<b>Resolved</b> ${new Date(incidentsToday[i].resolved)}` : 'We are trying to resolve this ASAP. Hang tight.'}</div>
          </div>`);

        for (let report of incidentsToday[i].reports) {
          let element = document.getElementById(`incident-${i}`);
          element.insertAdjacentHTML('beforeend',
            `<div class="incident-description ${incidentsToday[i].resolved ? 'resolved': ''}">
              <b>${report.title}</b> - ${report.description}<br />
              <span class="incident-report-date">Posted ${new Date(report.time)}<span>
            </div>`);
        }

        if (!incidentsToday[i].resolved) outage = true;
      }

      if (outage) {
        let status = document.getElementById('status');
        if (status.innerHTML !== 'Major Service Outage') {
          status.innerHTML = 'Minor System Outage';
          $('#status').addClass('yellow');
          $('#status').removeClass('green');
        }
      }
    }
  }
});

$.ajax({
  url: '/data/announcement.json',
  dataType: 'json',
  error: (response, type, exception) => {
    console.error({
      exception: exception,
      type: type,
      response: response
    });
  },
  success: (announcement) => {
    if (announcement && announcement.title && announcement.description) {
      document.getElementById('announcement-title').innerHTML = announcement.title;
      document.getElementById('announcement-content').innerHTML = announcement.description;
    }
    else {
      document.getElementById('announcement').setAttribute('hidden', true);
    }
  }
});
