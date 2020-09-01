import React, { Component } from 'react'
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

class PrivacyPolicy extends Component {
	render() {
		const { dialogOnShow, dialogOnClose, dialogOnTransition } = this.props

		return (
			<Dialog fullScreen open={dialogOnShow} onClose={dialogOnClose} TransitionComponent={dialogOnTransition}>
				<AppBar>
					<Toolbar>
						<IconButton color="inherit" onClick={dialogOnClose}>
							<ArrowBack />
						</IconButton>
						<Typography variant="h6" color="inherit">
							{'Privacy and Policy'}
						</Typography>
					</Toolbar>
				</AppBar>
				<DialogContent>
					<div className="pt-70 pp-container">
						<div className="p-30 pp-wrapper">
							<span>
								<em>Effective May 25, 2018</em>
							</span>
							<h2>What this policy covers</h2>
							<br />
							<p>
								Your privacy is important to us, and so is being transparent about how we collect, use,
								and share information about you. This policy is intended to help you understand:
							</p>
							<ul className="pl-15">
								<li>What information we collect about you</li>
								<li>How we use information we collect</li>
								<li>How we share information we collect</li>
								<li>How we store and secure information we collect</li>
								<li>How to access and control your information</li>
								<li>How we transfer information we collect internationally</li>
								<li>Other important privacy information</li>
							</ul>
							<p>
								This Privacy Policy covers the information we collect about you when you use our
								products or otherwise interact with us (for example, via our support channels), unless a
								differentpolicy is displayed. Propertee Butler, we and us refers to ProperteeButler,
								Inc. We offer arange of products. We refer to all of these products, together with our
								other services andwebsites as "Services" in this policy.
							</p>
							<p>
								This policy also explains your choices about how we use information about you.
								Yourchoices include how you can object to certain uses of information about you and how
								youcan access and update certain information about you. ​
								<strong className="font-weight-bold">
									{' '}
									If you do not agree with this policy,do not access or use our Services or interact
									with any other aspect of our business.
								</strong>
							</p>
							<p>
								Where we provide the Services under contract with an organization (for example
								youremployer) that organization controls the information processed by the Services.
							</p>
							<br />
							<h2>What information we collect about you</h2>
							<p>
								We collect information about you when you provide it to us, when you use our Services,
								andwhen other sources provide it to us, as further described below.
							</p>
							<hr />
							<h3>Information you provide to us</h3>
							<br />
							<p>
								We collect information about you when you input it into the Services or otherwise
								provide itdirectly to us.
							</p>
							<p>
								<em className="font-weight-bold">Account and Profile Information:​</em>We collect
								information about you when you register for anaccount, create or modify your profile,
								set preferences, sign-up for or make purchases through the Services. For example, you
								provide your contact information and, in some cases, billing information when you
								register for the Services. You also have the option of adding a display name, profile
								photo, and other details to your profile information to be displayed in our Services. We
								keep track of your preferences when you select settings withinthe Services.
							</p>
							<p>
								<em className="font-weight-bold">Content you provide through our products:​</em>The
								Services include the ProperteeButler productsyou use, where we collect and store content
								that youpost, send, receive and share. This content includesany information about you
								that you may choose toinclude: wecollect feedback you provide directly tous through the
								product and we collect click streamdata about how you interact with and usefeatures in
								the Services
							</p>
							<p>
								<em className="font-weight-bold">
									Information you provide through our support channels:​
								</em>
								The Services also include ourcustomer support, whereyou may choose to submit information
								regarding aproblem youare experiencing with a Service. Whetheryou designate yourself as
								an admin orbillingcontact, open a support ticket, speak to oneof our representatives
								directly or otherwiseengagewith our support team, you will be asked to providecontact
								information, a summaryof the problem you areexperiencing, and any other documentation,
								screenshots or information that would be helpful in resolving the issue.
							</p>
							<p>
								<em className="font-weight-bold">Payment Information:​</em>We collect certain payment
								and billing informationwhen you registerfor certain paid Services. For example, we ask
								you to designate a billingrepresentative,including name and contact information, upon
								registration. You might alsoprovide payment information, such as payment carddetails,
								which we collect via secure paymentprocessing services.
							</p>
							<hr />
							<h3>Information we collect automatically when you use the Services</h3>
							<br />
							<p>
								We collect information about you when you use our Services, including browsing
								ourwebsites and taking certain actions within the Services.
							</p>
							<p>
								<em className="font-weight-bold">Your use of the Services:</em> We keep track of certain
								information about you when you visit andinteract with any of our Services. This
								information includes the features you use; the linksyou click on and how you interact
								with others on the Services. We also collect informationabout the teams and people you
								work with and how you work with them, like who youcollaborate with and communicate with
								most frequently.
							</p>
							<p>
								<em className="font-weight-bold">Device and Connection Information:​ </em> We collect
								information about the computer you use toaccess the Services. This device information
								includes your connection type and settingswhen you install, access, update, or use our
								Services. We also collect information throughyour device about your operating system,
								browser type, IP address, URLs of referring/exitpages, device identifiers, and crash
								data. We use your IP address and/or country preferencein order to approximate your
								location to provide you with a better Service experience. How much of this information
								we collect depends on the type and settings of the device you useto access the Services.
							</p>
							<p>
								<em className="font-weight-bold">Cookies and Other Tracking Technologies:​ </em>
								ProperteeButler and our third-party partners,such as our advertising and analytics
								partners, use cookies and other tracking technologies(e.g., web beacons, device
								identifiers and pixels) to provide functionality and to recognizeyou across different
								Services and devices.
							</p>

							<hr />
							<h3>Information we receive from other sources</h3>
							<br />
							<p>We receive information about you from other Service users, from third-party services.</p>
							<p>
								<em className="font-weight-bold">Other users of the Services:​ </em>Other users of our
								Services may provide information about youwhen they submit content through the Services.
								For example, you may be mentioned in asupport ticket opened by someone else. We also
								receive your email address from otherService users when they provide it in order to
								invite you to the Services. Similarly, anadministrator may provide your contact
								information when they designate you as the billingor admin on your company&#39;s
								account.
							</p>
							<p>
								<em className="font-weight-bold">Other services you link to your account:​</em> We
								receive information about you when you oryour administrator integrate or link a
								third-party service with our Services. For example, ifyou create an account or log into
								the Services using your Google credentials, we receiveyour name and email address as
								permitted by your Google profile settings in order toauthenticate you. You or your
								administrator may also integrate our Services with otherservices you use. The
								information we receive when you link or integrate our Services with athird-party service
								depends on the settings, permissions and privacy policy controlled bythat third-party
								service. You should always check the privacy settings and notices in thesethird-party
								services to understand what data may be disclosed to us or shared with ourServices.
							</p>
							<p>
								<em className="font-weight-bold">ProperteeButler Partners:​ </em>We work with a variety
								of Resellers who provide purchasing andother services around our products. We receive
								information from these resellers, such asbilling information, billing and admin contact
								information, company name, whatProperteeButler products you have purchased or may be
								interested in.
							</p>
							<br />
							<h2>How we use information we collect</h2>
							<br />
							<p>
								Below are the specific purposes for which we use the information we collect about you.
							</p>
							<p>
								<em className="font-weight-bold">
									To provide the Services and personalize your experience:​
								</em>
								We use information about you toprovide the Services to you, including to process
								transactions with you, authenticate youwhen you log in, provide customer support, and
								operate and maintain the Services. Forexample, we use the name and picture you provide
								in your account to identify you to otherService users. Our Services also include
								tailored features that personalize your experience,enhance your productivity, and
								improve your ability to collaborate effectively with others byautomatically analyzing
								the activities of your team to provide activity feeds and notificationsthat are relevant
								for you and your team. We may use your email domain to infer youraffiliation with a
								particular organization or industry to personalize the content andexperience you receive
								on our websites. Where you use multiple Services, we combineinformation about you and
								your activities to provide an integrated experience, such as to allow you to find
								information from one Service while searching from another or to presentrelevant product
								information as you travel across our websites.
							</p>
							<p>
								<em className="font-weight-bold">For research and development:​</em> We are always
								looking for ways to make our Servicessmarter, faster, secure, integrated, and useful to
								you. We use collective learnings about howpeople use our Services and feedback provided
								directly to us to troubleshoot and to identifytrends, usage, activity patterns and areas
								for integration and improvement of the Services.We also test and analyze certain new
								features with some users before rolling the feature outto all users.
							</p>
							<p>
								<em className="font-weight-bold">To communicate with you about the Services:​</em> We
								use your contact information to sendtransactional communications via email and within
								the Services, including confirming yourpurchases, reminding you of subscription
								expirations, responding to your comments,questions and requests, providing customer
								support, and sending you technical notices,updates, security alerts, and administrative
								messages. We also send you communications asyou onboard to a particular Service to help
								you become more proficient in using thatService. These communications are part of the
								Services and in most cases you cannot optout of them. If an opt out is available, you
								will find that option within the communicationitself or in your account settings
							</p>

							<p>
								<em className="font-weight-bold">
									To market, promote and drive engagement with the Services:​
								</em>{' '}
								We use your contactinformation and information about how you use the Services to send
								promotionalcommunications that may be of specific interest to you, including by email
								and by displayingProperteeButler ads on other companies&#39; websites and applications,
								as well as on platformslike Facebook and Google. These communications are aimed at
								driving engagement andmaximizing what you get out of the Services, including information
								about new features,survey requests, newsletters, and events we think may be of interest
								to you. We alsocommunicate with you about new product offers, promotions and contests.
								You can controlwhether you receive these communications as described below under
								"Opt-out ofcommunications."
							</p>

							<p>
								<em className="font-weight-bold">For Customer support:​</em> We use your information to
								resolve technical issues you encounter,to respond to your requests for assistance, to
								analyze crash information, and to repair andimprove the Services.
							</p>

							<p>
								<em className="font-weight-bold">For safety and security:​</em> We use information about
								you and your Service use to verifyaccounts and activity, to monitor suspicious or
								fraudulent activity and to identify violationsof Service policies.
							</p>

							<p>
								<em className="font-weight-bold">
									To protect our legitimate business interests and legal rights:​{' '}
								</em>{' '}
								Where required by law orwhere we believe it is necessary to protect our legal rights,
								interests and the interests ofothers, we use information about you in connection with
								legal claims, compliance,regulatory, and audit functions, and disclosures in connection
								with the acquisition, mergeror sale of a business.
							</p>
							<p>
								<em className="font-weight-bold">With your consent:​</em> We use information about you
								where you have given us consent to doso for a specific purpose not listed above. For
								example, we may publish testimonials orfeatured customer stories to promote the
								Services, with your permission
							</p>
							<p>
								<span className="font-weight-bold">Legal bases for processing (for EEA users):</span>
								If you are an individual in the European Economic Area (EEA), we collect and
								processinformation about you only where we have legal bases for doing so under
								applicable EUlaws. The legal bases depend on the Services you use and how you use them.
								This meanswe collect and use your information only where:
							</p>
							<ul className="pl-15">
								<li>
									We need it to provide you the Services, including to operate the Services,
									providecustomer support and personalized features and to protect the safety and
									securityof the Services;
								</li>
								<li>
									It satisfies a legitimate interest (which is not overridden by your data
									protectioninterests), such as for research and development, to market and promote
									theServices and to protect our legal rights and interests;
								</li>
								<li>You give us consent to do so for a specific purpose; or</li>
								<li>We need to process your data to comply with a legal obligation.</li>
							</ul>
							<p>
								If you have consented to our use of information about you for a specific purpose, you
								havethe right to change your mind at any time, but this will not affect any processing
								that hasalready taken place. Where we are using your information because we or a third
								party (e.g.your employer) have a legitimate interest to do so, you have the right to
								object to that usethough, in some cases, this may mean no longer using the Services.
							</p>
							<br />
							<h2>How we share information we collect</h2>
							<br />
							<p>
								We do not sell, trade, or otherwise transfer to outside parties your personally
								identifiable information. This does not include trusted third parties who assist us in
								operating ourwebsite, conducting our business, or servicing you, so long as those
								parties agree to keepthis information confidential. We may also release your information
								when we believerelease is appropriate to comply with the law, enforce our site policies,
								or protect ours orothers rights, property, or safety. However, non-personally
								identifiable visitor informationmay be provided to other parties for marketing,
								advertising, or other uses.
							</p>
							<br />
							<hr />
							<h3>Sharing with other Service users</h3>
							<br />
							<p>
								When you use the Services, we share certain information about you with other
								Serviceusers.
							</p>
							<p>
								<em className="font-weight-bold">For collaboration:​ </em>You can create content, which
								may contain information about you, andgrant permission to others to see, share, edit,
								copy and download that content based onsettings you or your administrator (if
								applicable) select.
							</p>
							<p>
								<em className="font-weight-bold">Managed accounts and administrators:​ </em>If you
								register or access the Services using an emailaddress with a domain that is owned by
								your employer or organization, and suchorganization wishes to establish an account or
								site, certain information about you includingyour name, profile picture, contact info,
								content and past use of your account may becomeaccessible to that organization’s
								administrator and other Service users sharing the same domain. If you are an
								administrator for a particular site or group of users within theServices, we may share
								your contact information with current or past Service users, for thepurpose of
								facilitating Service-related requests.
							</p>
							<p>
								<em className="font-weight-bold">Community Forums:​ </em>Our websites offer publicly
								accessible blogs, forums, issue trackers,and wikis like ProperteeButler Community. You
								should be aware that any information youprovide on these websites - including profile
								information associated with the account youuse to post the information - may be read,
								collected, and used by any member of the publicwho accesses these websites. Your posts
								and certain profile information may remain evenafter you delete your account. We urge
								you to consider the sensitivity of any information you input into these Services. To
								request removal of your information from publiclyaccessible websites operated by us,
								please contact us as provided below. In some cases, wemay not be able to remove your
								information, in which case we will let you know if we areunable to and why.
							</p>
							<hr />
							<h3>Sharing with third parties</h3>
							<br />
							<p>
								We share information with third parties that help us operate, provide, improve,
								integrate,customize, support and market our Services.
							</p>
							<p>
								<em className="font-weight-bold">Service Providers:​ </em>We work with third-party
								service providers to provide website andapplication development, hosting, maintenance,
								backup, storage, virtual infrastructure,payment processing, analysis and other services
								for us, which may require them to accessor use information about you. If a service
								provider needs to access information about you toperform services on our behalf, they do
								so under close instruction from us, includingpolicies and procedures designed to protect
								your information.
							</p>

							<p>
								<em className="font-weight-bold">Third Party Apps:​ </em>You, your administrator or
								other Service users may choose to add newfunctionality or change the behavior of the
								Services by enabling integrations with third partyapps within the Services. Doing so may
								give third-party apps access to your account andinformation about you like your name and
								email address, and any content you choose touse in connection with those apps
							</p>
							<p>
								Third-party app policies and procedures are not controlled by us, and this privacy
								policydoes not cover how third-party apps use your information. We encourage you to
								review theprivacy policies of third parties before connecting to or using their
								applications or servicesto learn more about their privacy and information handling
								practices. If you object toinformation about you being shared with these third parties,
								please uninstall the app.
							</p>
							<p>
								<em className="font-weight-bold">Links to Third Party Sites:​ </em>The Services may
								include links that direct you to other websites orservices whose privacy practices may
								differ from ours. If you submit information to any ofthose third party sites, your
								information is governed by their privacy policies, not this one.We encourage you to
								carefully read the privacy policy of any website you visit.
							</p>
							<p>
								<em className="font-weight-bold">Third-Party Widgets:​ </em>Some of our Services contain
								widgets and social media features, suchas the Twitter "tweet" button. These widgets and
								features collect your IP address, whichpage you are visiting on the Services, and may
								set a cookie to enable the feature to function properly. Widgets and social media
								features are either hosted by a third party or hosteddirectly on our Services. Your
								interactions with these features are governed by the privacypolicy of the company
								providing it.
							</p>
							<p>
								<em className="font-weight-bold">
									Compliance with Enforcement Requests and Applicable Laws; Enforcement of Our Rights:
								</em>
								In exceptional circumstances, we may share information about you with a third party if
								webelieve that sharing is reasonably necessary to (a) comply with any applicable
								law,regulation, legal process or governmental request, including to meet national
								securityrequirements, (b) enforce our agreements, policies and terms of service, (c)
								protect thesecurity or integrity of our products and services, (d) protect
								ProperteeButler, our customersor the public from harm or illegal activities, or (e)
								respond to an emergency which we believein good faith requires us to disclose
								information to assist in preventing the death or seriousbodily injury of any person.
							</p>
							<br />
							<h2>How we store and secure information we collect</h2>
							<br />
							<hr />
							<h3>Information storage and security</h3>
							<br />
							<p>
								We use data hosting service providers in the United States and host the information
								wecollect, and we use technical measures to secure your data
							</p>
							<p>
								While we implement safeguards designed to protect your information, no security system
								isimpenetrable and due to the inherent nature of the Internet, we cannot guarantee
								thatdata, during transmission through the Internet or while stored on our systems or
								otherwisein our care, is absolutely safe from intrusion by others.
							</p>
							<br />
							<hr />
							<h3>How long we keep information</h3>
							<br />
							<p>
								How long we keep information we collect about you depends on the type of information,
								asdescribed in further detail below. After such time, we will either delete or anonymize
								yourinformation.
							</p>
							<p>
								<em className="font-weight-bold">Account information:​ </em>We retain your account
								information for as long as your account isactive and up to six months thereafter in case
								you decide to re-activate the Services. We alsoretain some of your information as
								necessary to comply with our legal obligations, toresolve disputes, to enforce our
								agreements, to support business operations, and tocontinue to develop and improve our
								Services.
							</p>
							<p>
								<em className="font-weight-bold">Information you share on the Services:​ </em>If your
								account is deleted, some of your informationand the content you have provided will
								remain in order to allow your team members orother users to make full use of the
								Services.
							</p>

							<p>
								<em className="font-weight-bold">Managed accounts:​ </em>If the Services are made
								available to you through an organization (e.g.,your employer), we retain your
								information as long as required by the administrator of youraccount.
							</p>

							<p>
								<em className="font-weight-bold">Marketing information:​ </em>If you have elected to
								receive marketing emails from us, we retaininformation about your marketing preferences
								for a reasonable period of time from thedate you last expressed interest in our
								Services, such as when you last opened an emailfrom us or ceased using your
								ProperteeButler account. We retain information derived from cookies and other tracking
								technologies for a reasonable period of time from the date such information was created.
							</p>
							<br />
							<h2>How to access and control your information</h2>
							<br />
							<p>
								You have certain choices available to you when it comes to your information. Below is
								asummary of those choices, how to exercise them and any limitations.
							</p>
							<hr />
							<h3>Your Choices:</h3>
							<br />
							<p>
								You have the right to request a copy of your information, to object to our use of
								yourinformation (including for marketing purposes), to request the deletion or
								restriction of yourinformation, or to request your information in a structured,
								electronic format. Below, wedescribe the tools and processes for making these requests.
								You may contact us asprovided in the Contact Us section below to request assistance.
							</p>
							<p>
								Your request and choices may be limited in certain cases: for example, if fulfilling
								yourrequest would reveal information about another person, or if you ask to delete
								informationwhich we or your administrator are permitted by law or have compelling
								legitimate intereststo keep. Where you have asked us to share data with third parties,
								for example, by installingthird-party apps, you will need to contact those third-party
								service providers directly to haveyour information deleted or otherwise restricted. If
								you have unresolved concerns, you mayhave the right to complain to a data protection
								authority in the country where you live,where you work or where you feel your rights
								were infringed
							</p>
							<p>
								<em className="font-weight-bold">Access and update your information:​ </em>Our Services
								and related documentation give you theability to access and update certain information
								about you from within the Service. You canupdate your profile information within your
								profile settings.
							</p>
							<hr />
							<h3>Information you provide to us</h3>
							<br />
							<p>
								We collect information about you when you input it into the Services or otherwise
								provide itdirectly to us.
							</p>
							<p>
								<em className="font-weight-bold">Delete your account:​ </em>If you no longer wish to use
								our Services, you or your administratormay be able to delete your Services account. If
								you can delete your own account, thatsetting is available to you in your account
								settings. Otherwise, please contact youradministrator. You may also contact
								ProperteeButler support{' '}
								<a href="mailto:info@ProperteeButler.com">(​info@ProperteeButler.com​) </a>to request
								your account be deleted.
							</p>
							<p>
								<em className="font-weight-bold">Request that we stop using your information:​ </em>
								In some cases, you may ask us to stop accessing, storing, using and otherwise processing
								your information where you believe we don&#39;t have the appropriate rights to do so.
								For example, if you believe a Services accountwas created for you without your
								permission or you are no longer an active user, you canrequest that we delete your
								account as provided in this policy. Where you gave us consentto use your information for
								a limited purpose, you can contact us to withdraw that consent,but this will not affect
								any processing that has already taken place at the time. You can alsoopt-out of our use
								of your information for marketing purposes by contacting us, as provided below. When you
								make such requests, we may need time to investigate and facilitate yourrequest. If there
								is delay or dispute as to whether we have the right to continue using yourinformation,
								we will restrict any further use of your information until the request is honoredor the
								dispute is resolved, provided your administrator does not object (where applicable). If
								you object to information about you being shared with a third-party integration,
								pleasedisable the integration or contact your administrator to do so.
							</p>

							<p>
								<em className="font-weight-bold">Opt out of communications:​ </em>You may opt out of
								receiving promotional communicationsfrom us by using the unsubscribe link within each
								email, or by contacting us as providedbelow to have your contact information removed
								from our promotional email list or registration database. Even after you opt out from
								receiving promotional messages from us,you will continue to receive transactional
								messages from us regarding our Services.
							</p>

							<p>
								<em className="font-weight-bold">Data portability:​ </em>Data portability is the ability
								to obtain some of your information in aformat you can move from one service provider to
								another (for instance, when you transferyour mobile phone number to another carrier).
								Depending on the context, this applies tosome of your information, but not to all of
								your information. Should you request it, we willprovide you with an electronic file of
								your basic account information and the informationyou create on the spaces you under
								your sole control, like your personal ProperteeButleraccount
							</p>
							<br />
							<h2>How we transfer information we collectinternationally</h2>
							<br />
							<hr />
							<br />
							<h3>International transfers of information we collect</h3>
							<br />
							<p>
								We collect information globally and primarily store that information in the United
								States. Wetransfer, process and store your information outside of your country of
								residence, towherever we or our third-party service providers operate for the purpose of
								providing youthe Services. Whenever we transfer your information, we take steps to
								protect it.
							</p>
							<p>
								<em className="font-weight-bold">
									{' '}
									International transfers within ProperteeButler Companies:​{' '}
								</em>
								To facilitate our globaloperations, we transfer information to the United States and
								allow access to that in formation from countries in which ProperteeButler has operations
								for the purposes described in this policy. These countries may not have equivalent
								privacy and dataprotection laws to the laws of many of the countries where our customers
								and users arebased.
							</p>
							<p>
								<em className="font-weight-bold">International transfers to third parties:​ </em>
								Some of the third parties described in this privacy policy, which provide services to us
								under contract, are based in other countries that maynot have equivalent privacy and
								data protection laws to the country in which you reside
							</p>

							<br />
							<h2>Other important privacy information</h2>
							<br />
							<hr />
							<br />
							<h3>Notice to End Users</h3>
							<br />
							<p>
								Some of our products are intended for use by organizations. Where the Services are
								madeavailable to you through an organization (e.g. your employer), that organization is
								theadministrator of the Services and is responsible for the accounts and/or Service
								sites overwhich it has control. If this is the case, please direct your data privacy
								questions to youradministrator, as your use of the Services is subject to that
								organization&#39;s policies. We are not responsible for the privacy or security
								practices of an administrator&#39;s organization,which may be different than this
								policy.
							</p>
							<p>Administrators are able to:</p>
							<ul className="pl-15">
								<li>terminate your access to the Services;</li>
								<li>install or uninstall third-party integrations</li>
							</ul>
							<p>
								Even if the Services are not currently administered to you by an organization, if you
								use anemail address provided by an organization (such as your work email address) to
								access theServices, then the owner of the domain associated with your email address
								(e.g. youremployer) may assert administrative control over your account and use of the
								Services at alater date. You will be notified if this happens.{' '}
							</p>
							<p>
								If you do not want an administrator to be able to assert control over your account or
								use ofthe Services, use your personal email address to register for or access the
								Services. If anadministrator has not already asserted control over your account or
								access to the Services,you can update the email address associated with your account
								through your accountsettings in your profile. Once an administrator asserts control over
								your account or use ofthe Services, you will no longer be able to change the email
								address associated with youraccount without administrator approval.
							</p>
							<p>
								Please contact your organization or refer to your administrator’s organizational
								policies formore information.
							</p>
							<br />
							<hr />
							<h3>California Online Privacy Protection Act Compliance</h3>
							<br />
							<p>
								Because we value your privacy we have taken the necessary precautions to be in
								compliancewith the California Online Privacy Protection Act. We therefore will not
								distribute yourpersonal information to outside parties without your consent. As part of
								the CaliforniaOnline Privacy Protection Act, all users of our site may make any changes
								to theirinformation at anytime by logging into their control panel and going to the ​
								<strong className="font-weight-bold">'Edit Profile'</strong> page.
							</p>
							<p>
								<em className="font-weight-bold" />
							</p>

							<hr />
							<h3>Our policy towards children</h3>
							<br />
							<p>
								We are in compliance with the requirements of EU’s General Data Protection
								Regulation(“GDPR”) and the Childrens Online Privacy Protection Act Compliance
								(“COPPA”).Our website,products and services are all directed to people who are at least
								16 years old or older.
							</p>

							<hr />
							<h3>Changes to our Privacy Policy</h3>
							<br />
							<p>
								{' '}
								We may change this privacy policy from time to time.We will post any privacy policy
								changes on this page and, if the changes are significant, we will provide a more
								prominentnotice by adding a notice on the Services homepages, login screens, or by
								sending you anemail notification. We will also keep prior versions of this Privacy
								Policy in an archive foryour review. We encourage you to review our privacy policy
								whenever you use the Servicesto stay informed about our information practices and the
								ways you can help protect your privacy.
							</p>
							<p>
								{' '}
								If you disagree with any changes to this privacy policy, you will need to stop using
								theServices and delete your account(s), as outlined above.
							</p>
							<br />
							<p>Please Contact: info@properteebutler.com</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		)
	}
}

export default PrivacyPolicy
