/**
 * Sends a one-off email
 */
 var TEAM_MANDRILL_API_KEY = process.env.TEAM_MANDRILL_API_KEY;
 var TEAM_MANDRILL_DOMAIN = process.env.TEAM_MANDRILL_DOMAIN;
 var TEAM_ORG = process.env.TEAM_ORG;

var mandrill = require('mandrill-api');
var mandrill_client = new mandrill.Mandrill(TEAM_MANDRILL_API_KEY);

/**
 * Sends a one-off email using Mandrill (part of mailchimp)
 *
 * @param {object} params Various parameters
 * @params {string} params.html HTML version of mail body
 * @params {string} params.text Plain text version of mail body
 * @params {string} params.subject Mail subject
 * @params {string} params.email Email for recipient
 * @params {string} params.name Name for recipient
 * @params {function} callback  Parameters(err, result)
 *    where result looks like this:
 *       [ { email: 'joe@example.com',
 *           status: 'sent',
 *           _id: 'd1cdca9c780f4fcfaef5c28c16e31fb6',
 *           reject_reason: null } ]
 *    and err has properties name and message
 */
module.exports = function(params, callback) {

//FIXME: uncomment when on an airplane
/*
callback(null);
console.log('sendMail. params=');
console.dir(params);
return;
*/

	var message = {
	    /*"html": "<p>Example HTML content - #2</p>",*/
	    "html": params.html,
	    /*"text": "Example text content",*/
	    "text": params.text,
	    /*"subject": "example subject #2",*/
	    "subject": params.subject,
	    "from_email": "no-reply@"+TEAM_MANDRILL_DOMAIN,
	    "from_name": TEAM_ORG,
	    /*
	    "to": [{
	            "email": "jon@"+TEAM_MANDRILL_DOMAIN,
	            "name": "Jon Ferraiolo",
	            "type": "to"
	        }],
	    */
	    "to": [{
	            "email": params.email,
	            "name": params.name,
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "no-reply@"+TEAM_MANDRILL_DOMAIN
	    },
	    "important": false,
	    "track_opens": null,
	    "track_clicks": null,
	    "auto_text": null,
	    "auto_html": null,
	    "inline_css": null,
	    "url_strip_qs": null,
	    "preserve_recipients": null,
	    "view_content_link": null,
	    /* "bcc_address": "admin@"+TEAM_MANDRILL_DOMAIN, */
	    "tracking_domain": null,
	    "signing_domain": null,
	    "return_path_domain": null,
	    "merge": true,
	    "merge_language": "mailchimp",
	    "global_merge_vars": [],
	    "merge_vars": [],
	    "tags": [
	        TEAM_ORG
	    ],
	    /* "subaccount": "jon@"+TEAM_MANDRILL_DOMAIN,*/
	    "google_analytics_domains": [
	       TEAM_MANDRILL_DOMAIN
	    ],
	    /* "google_analytics_campaign": "", */
	    "metadata": {
	        "website": TEAM_MANDRILL_DOMAIN
	    },
	    "recipient_metadata": [{
	            /*"rcpt": "jon@"+TEAM_MANDRILL_DOMAIN*/
	            "rcpt": params.email,
	        }],
	    "attachments": [],
	    "images": []
	};
	var async = false;
	var ip_pool = "Main Pool";
	var send_at = "example send_at";
	mandrill_client.messages.send({"message": message /*, "async": async, "ip_pool": ip_pool, "send_at": send_at*/}, function(result) {
console.log('mandrill_client success');
	    callback(null, result);
	    /*console.log(result);*.
	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
console.log('mandrill_client failure');
	    callback(e);
	});
};
