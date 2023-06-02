const text1 = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in...`;

const text2 = `Id aliquet risus feugiat in ante metus dictum. Malesuada fames ac turpis egestas maecenas pharetra. Massa ultricies mi quis hendrerit dolor. Nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus. Rhoncus urna neque viverra justo. `;

const text3 = `The pandemic hit during World War I and devastated military troops. In the United States, for instance, more servicemen were killed from the flu than from the war itself. The Spanish flu was fatal to a higher proportion of young adults than most flu virus.`; 

const text4 = `Erat patri filioque unus parvus asellus: vicissim vehebantur asino et laborem viae levabant. Dum genitor vehitur et natus pedibus suis venit, irridebant obvii: "En, aiebant, moribundus inutilisque seniculus, dum valitudini suae parcit, formosum perdit...`;

const text5 = `Desiluit senex et invitum natum in suum locum imposuit. Murmuravit viatorum turba: "En, segnis et praevalidus adulescens, dum propriae indulget ignaviae, decrepitum patrem mactat". Pudore ille victus, patrem coegit ascendere. Ita uno quadrupede simul...`;

const text6 = `Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Nibh nisl condimentum id venenatis a condimentum vitae. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Vel quam elementum pulvinar etiam non quam. `;

const text7 = `Hic bella reparavit, Albanos vicit, qui ab urbe Roma duodecimo miliario sunt, Veientes et Fidenates, quorum alii sexto miliario absunt ab urbe Roma, alii octavo decimo, bello superavit, urbem ampliavit adiecto Caelio monte. Cum triginta et duos annos...`;

const text8 = `Quod Chilo consilium anceps pro salute amici cepit; quodque est circumspecte et anxie considerandum, an pro utilitatibus amicorum delinquendum aliquando sit; notataque inibi et relata, quae et Theophrastus et M. Cicero super ea re scripserunt. 1 Laced...`;

const text9 = `Hyrcanaeque admorunt ubera tigres, quoniam uidelicet in moribus inolescendis magnam fere partem ingenium altricis et natura lactis tenet, quae iam a principio imbuta paterni seminis concretione ex matris etiam corpore et animo recentem indolem conf... `;

const text10 = `Valgius Rufus in secundo librorum, quos inscripsit de rebus per epistulam quaesitis, 'lictorem' dicit a 'ligando' appellatum esse, quod, cum magistratus populi Romani uirgis quempiam uerberari iussissent, crura eius et manus ligari uincirique a uiatore. `;

const texts = [text1, text2, text3, text4, text5, text6, text7, text8, text9, text10];

function getRandomText() {
  const randomIndex = Math.floor(Math.random() * 9); 
  return texts[randomIndex]; 
}

const text = getRandomText();

export default text;