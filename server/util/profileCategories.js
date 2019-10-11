
module.exports = {

  // task types that expand into multiple steps in the task wizard
  profileTypes: ['TaskYourProfileWizard', 'TaskPersonProfileWizard', 'TaskOrgProfileWizard'],
  profileQualifiers: ['you', 'person', 'org'],

  // In the profile wizard, each category gets its own screen (step).
  // Each category must have 'category' and 'long' (long description)
  // Optional properties are:
  //   qualifier:internetPlatform if this category requires an extra qualifier value
  person: [
    { category:'vital', title:'((This person\'s)) basic vital identity information', long:`((vital))`},
    { category:'name', title:'((This person\'s)) names', long:`((names))`},
    { category:'internetId', title:'((This person\'s)) Internet sites and social media accounts', qualifier:'internetPlatform', long:`
      Provide the URL/hyperlink for each relevant websites, social media account, blog or other Web/Internet addresses or identities
      that ((this person)) ((has)). For social media, provide the the URL for ((this person\'s)) base/home page
      on the given social media platform (e.g., https://twitter.com/KimKardashian).`},
    { category:'education', title:'((This person\'s)) education', long:`
      Provide any pertinent information about ((this person\'s)) education.`},
    { category:'employment', title:'((This person\'s)) employment history', long:`
      Provide any pertinent information about ((this person\'s)) employment history.`},
    { category:'activity', title:'((This person\'s)) activities, associations and affiliations', long:`
      Provide any other pertinent information about ((this person\'s)) activities, associations and affiliations.`},
    { category:'authority', title:'Domains of public activity and authoritative comment', long:`
      List the areas in which ((this person)) ((makes)) public authoritative comments that influence others.
      For example, a lawyer might blog on legal matters and a medical doctor might have a TV program on health issues.
      Some people comment authoritatively about politics on social media and influence the opinions of loyal followers,
      in some cases without a relevant degree or experience.`},
    { category:'legal', title:'((This person\'s)) legal and criminal trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness with regard to legal and criminal behavior.</p>
      <p>Example trustworthy behavior: never in legal or criminal trouble.</p>
      <p>Example untrustworthy behavior: convictions or court judgments against.</p>
      ((OkPreferNot))`},
    { category:'financial', title:'((This person\'s)) financial trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness in financial relationships.</p>
      <p>Example trustworthy behavior: always honor financial obligations.</p>
      <p>Example untrustworthy behavior: stealing, cheating and reneging on financial obligations.</p>
      ((OkPreferNot))`},
    { category:'relationship', title:'((This person\'s)) relationship trustworthiness', long:`
      <p>Provide any other pertinent information about ((this person\'s)) trustworthiness in personal relationships.</p>
      <p>Example trustworthy behavior: honesty and honoring marriage vows.</p>
      <p>Example untrustworthy behavior: murder, sexual assault/harassment, lying, cheating and abuse.</p>
      ((OkPreferNot))`},
    { category:'statement', title:'Public statements that reflect on ((this person\'s)) trustworthiness', long:`
      List public statements that ((this person)) ((has)) made that reflect on ((this person\'s)) trustworthiness.
      Common sources of such statements are blogs, social media accounts, news articles, books, podcasts and videos.
      Always provide a URL/hyperlink so that the source material is available for everyone to review.`},
    { category:'other', title:'Other relevant information about ((this person))', long:`
      Provide any other pertinent information about ((this person)).`}
  ],

  // Possible values for qualifier property, with supporting details
  qualifiers: {
    internetPlatform: [
      { name:'website', title:'Website or blog', multiple:true },
      { name:'facebook', title:'Facebook', multiple:false },
      { name:'twitter', title:'Facebook', multiple:false },
      { name:'linkedin', title:'Facebook', multiple:false }
    ]
  },

  // Substitution values
  // Three possible values for when completing a profile for you, another person or an organization
  // if all is present, that matches any qualifier
  // If a value is missing, for ((blah))  use "blah"
  variables: {
    '((is))':  { you:'are'},
    '((has))':  { you:'have'},
    '((makes))':  { you:'make'},
    '((A person\'s))':  { you:'Your', org:'An organization\'s'},
    '((person))': { org:'organization' },
    '((people))': { org:'organizations' },
    '((this person))': { you:'you', org:'this organization' },
    '((this person\'s))': { you:'your', org:'this organization\'s' },
    '((This person\'s))': { you:'Your', org:'This organization\'s' },
    '((the person\'s))': { you:'your', org:'the organization\'s' },
    '((If possible, include))': { you:'Include'},
    '((official_examples))': { you:'a passport, driver\'s license or tax return', person:'a passport, driver\'s license or tax return', org:'contracts or government forms' },
    '((vital))': { all: `
      Provide basic identity information that will help to uniquely distinguish ((this person)) versus other ((people))
      with the same or similar names.
      ((If possible, include)) ((the person\'s)) legal name, such as would appear on
      ((official_examples)).
      `},
    '((names))': { all: `
      List all names by which ((this person)) ((is)) commonly known
      to the general public. Include nicknames if used in public situations.
      `},
    '((OkPreferNot))': { you:`<p>If you have been untrustworthy in the past and now you have improved your behavior,
      feel free to confess and explain how you have redeemed yourself.
      If you acted in a way that could be construed as untrustworthy but
      there were special circumstances that justified the behavior,
      feel free to explain the situation and circumstances. </p>
      <p>If you prefer not to answer, then leave this section blank.</p>`, person:'', org:'' }
  }

}
