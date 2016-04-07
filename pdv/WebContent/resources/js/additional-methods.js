/*! jQuery Validation Plugin - v1.14.0 - 6/30/2015
 * http://jqueryvalidation.org/
 * Copyright (c) 2015 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof d/*!
	 * jQuery Validation Plugin v1.14.0
	 *
	 * http://jqueryvalidation.org/
	 *
	 * Copyright (c) 2015 Jörn Zaefferer
	 * Released under the MIT license
	 */
	(function( factory ) {
		if ( typeof define === "function" && define.amd ) {
			define( ["jquery", "./jquery.validate"], factory );
		} else {
			factory( jQuery );
		}
	}(function( $ ) {

	(function() {

		function stripHtml(value) {
			// remove html tags and space chars
			return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
			// remove punctuation
			.replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
		}

		$.validator.addMethod("maxWords", function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
		}, $.validator.format("Please enter {0} words or less."));

		$.validator.addMethod("minWords", function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
		}, $.validator.format("Please enter at least {0} words."));

		$.validator.addMethod("rangeWords", function(value, element, params) {
			var valueStripped = stripHtml(value),
				regex = /\b\w+\b/g;
			return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
		}, $.validator.format("Please enter between {0} and {1} words."));

	}());

	// Accept a value from a file input based on a required mimetype
	$.validator.addMethod("accept", function(value, element, param) {
		// Split mime on commas in case we have multiple types we can accept
		var typeParam = typeof param === "string" ? param.replace(/\s/g, "").replace(/,/g, "|") : "image/*",
		optionalValue = this.optional(element),
		i, file;

		// Element is optional
		if (optionalValue) {
			return optionalValue;
		}

		if ($(element).attr("type") === "file") {
			// If we are using a wildcard, make it regex friendly
			typeParam = typeParam.replace(/\*/g, ".*");

			// Check if the element has a FileList before checking each file
			if (element.files && element.files.length) {
				for (i = 0; i < element.files.length; i++) {
					file = element.files[i];

					// Grab the mimetype from the loaded file, verify it matches
					if (!file.type.match(new RegExp( "\\.?(" + typeParam + ")$", "i"))) {
						return false;
					}
				}
			}
		}

		// Either return true because we've validated each file, or because the
		// browser does not support element.files and the FileList feature
		return true;
	}, $.validator.format("Please enter a value with a valid mimetype."));

	$.validator.addMethod("alphanumeric", function(value, element) {
		return this.optional(element) || /^\w+$/i.test(value);
	}, "Letters, numbers, and underscores only please");

	/*
	 * Dutch bank account numbers (not 'giro' numbers) have 9 digits
	 * and pass the '11 check'.
	 * We accept the notation with spaces, as that is common.
	 * acceptable: 123456789 or 12 34 56 789
	 */
	$.validator.addMethod("bankaccountNL", function(value, element) {
		if (this.optional(element)) {
			return true;
		}
		if (!(/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(value))) {
			return false;
		}
		// now '11 check'
		var account = value.replace(/ /g, ""), // remove spaces
			sum = 0,
			len = account.length,
			pos, factor, digit;
		for ( pos = 0; pos < len; pos++ ) {
			factor = len - pos;
			digit = account.substring(pos, pos + 1);
			sum = sum + factor * digit;
		}
		return sum % 11 === 0;
	}, "Please specify a valid bank account number");

	$.validator.addMethod("bankorgiroaccountNL", function(value, element) {
		return this.optional(element) ||
				($.validator.methods.bankaccountNL.call(this, value, element)) ||
				($.validator.methods.giroaccountNL.call(this, value, element));
	}, "Please specify a valid bank or giro account number");

	/**
	 * BIC is the business identifier code (ISO 9362). This BIC check is not a guarantee for authenticity.
	 *
	 * BIC pattern: BBBBCCLLbbb (8 or 11 characters long; bbb is optional)
	 *
	 * BIC definition in detail:
	 * - First 4 characters - bank code (only letters)
	 * - Next 2 characters - ISO 3166-1 alpha-2 country code (only letters)
	 * - Next 2 characters - location code (letters and digits)
	 *   a. shall not start with '0' or '1'
	 *   b. second character must be a letter ('O' is not allowed) or one of the following digits ('0' for test (therefore not allowed), '1' for passive participant and '2' for active participant)
	 * - Last 3 characters - branch code, optional (shall not start with 'X' except in case of 'XXX' for primary office) (letters and digits)
	 */
	$.validator.addMethod("bic", function(value, element) {
	    return this.optional( element ) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test( value );
	}, "Please specify a valid BIC code");

	/*
	 * Código de identificación fiscal ( CIF ) is the tax identification code for Spanish legal entities
	 * Further rules can be found in Spanish on http://es.wikipedia.org/wiki/C%C3%B3digo_de_identificaci%C3%B3n_fiscal
	 */
	$.validator.addMethod( "cifES", function( value ) {
		"use strict";

		var num = [],
			controlDigit, sum, i, count, tmp, secondDigit;

		value = value.toUpperCase();

		// Quick format test
		if ( !value.match( "((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)" ) ) {
			return false;
		}

		for ( i = 0; i < 9; i++ ) {
			num[ i ] = parseInt( value.charAt( i ), 10 );
		}

		// Algorithm for checking CIF codes
		sum = num[ 2 ] + num[ 4 ] + num[ 6 ];
		for ( count = 1; count < 8; count += 2 ) {
			tmp = ( 2 * num[ count ] ).toString();
			secondDigit = tmp.charAt( 1 );

			sum += parseInt( tmp.charAt( 0 ), 10 ) + ( secondDigit === "" ? 0 : parseInt( secondDigit, 10 ) );
		}

		/* The first (position 1) is a letter following the following criteria:
		 *	A. Corporations
		 *	B. LLCs
		 *	C. General partnerships
		 *	D. Companies limited partnerships
		 *	E. Communities of goods
		 *	F. Cooperative Societies
		 *	G. Associations
		 *	H. Communities of homeowners in horizontal property regime
		 *	J. Civil Societies
		 *	K. Old format
		 *	L. Old format
		 *	M. Old format
		 *	N. Nonresident entities
		 *	P. Local authorities
		 *	Q. Autonomous bodies, state or not, and the like, and congregations and religious institutions
		 *	R. Congregations and religious institutions (since 2008 ORDER EHA/451/2008)
		 *	S. Organs of State Administration and regions
		 *	V. Agrarian Transformation
		 *	W. Permanent establishments of non-resident in Spain
		 */
		if ( /^[ABCDEFGHJNPQRSUVW]{1}/.test( value ) ) {
			sum += "";
			controlDigit = 10 - parseInt( sum.charAt( sum.length - 1 ), 10 );
			value += controlDigit;
			return ( num[ 8 ].toString() === String.fromCharCode( 64 + controlDigit ) || num[ 8 ].toString() === value.charAt( value.length - 1 ) );
		}

		return false;

	}, "Please specify a valid CIF number." );

	/*
	 * Brazillian CPF number (Cadastrado de Pessoas Físicas) is the equivalent of a Brazilian tax registration number.
	 * CPF numbers have 11 digits in total: 9 numbers followed by 2 check numbers that are being used for validation.
	 */
	$.validator.addMethod("cpfBR", function(value) {
		// Removing special characters from value
		value = value.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g, "");

		// Checking value to have 11 digits only
		if (value.length !== 11) {
			return false;
		}

		var sum = 0,
			firstCN, secondCN, checkResult, i;

		firstCN = parseInt(value.substring(9, 10), 10);
		secondCN = parseInt(value.substring(10, 11), 10);

		checkResult = function(sum, cn) {
			var result = (sum * 10) % 11;
			if ((result === 10) || (result === 11)) {result = 0;}
			return (result === cn);
		};

		// Checking for dump data
		if (value === "" ||
			value === "00000000000" ||
			value === "11111111111" ||
			value === "22222222222" ||
			value === "33333333333" ||
			value === "44444444444" ||
			value === "55555555555" ||
			value === "66666666666" ||
			value === "77777777777" ||
			value === "88888888888" ||
			value === "99999999999"
		) {
			return false;
		}

		// Step 1 - using first Check Number:
		for ( i = 1; i <= 9; i++ ) {
			sum = sum + parseInt(value.substring(i - 1, i), 10) * (11 - i);
		}

		// If first Check Number (CN) is valid, move to Step 2 - using second Check Number:
		if ( checkResult(sum, firstCN) ) {
			sum = 0;
			for ( i = 1; i <= 10; i++ ) {
				sum = sum + parseInt(value.substring(i - 1, i), 10) * (12 - i);
			}
			return checkResult(sum, secondCN);
		}
		return false;

	}, "Please specify a valid CPF number");

	/* NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
	 * Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
	 * Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
	 */
	$.validator.addMethod("creditcardtypes", function(value, element, param) {
		if (/[^0-9\-]+/.test(value)) {
			return false;
		}

		value = value.replace(/\D/g, "");

		var validTypes = 0x0000;

		if (param.mastercard) {
			validTypes |= 0x0001;
		}
		if (param.visa) {
			validTypes |= 0x0002;
		}
		if (param.amex) {
			validTypes |= 0x0004;
		}
		if (param.dinersclub) {
			validTypes |= 0x0008;
		}
		if (param.enroute) {
			validTypes |= 0x0010;
		}
		if (param.discover) {
			validTypes |= 0x0020;
		}
		if (param.jcb) {
			validTypes |= 0x0040;
		}
		if (param.unknown) {
			validTypes |= 0x0080;
		}
		if (param.all) {
			validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;
		}
		if (validTypes & 0x0001 && /^(5[12345])/.test(value)) { //mastercard
			return value.length === 16;
		}
		if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
			return value.length === 16;
		}
		if (validTypes & 0x0004 && /^(3[47])/.test(value)) { //amex
			return value.length === 15;
		}
		if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value)) { //dinersclub
			return value.length === 14;
		}
		if (validTypes & 0x0010 && /^(2(014|149))/.test(value)) { //enroute
			return value.length === 15;
		}
		if (validTypes & 0x0020 && /^(6011)/.test(value)) { //discover
			return value.length === 16;
		}
		if (validTypes & 0x0040 && /^(3)/.test(value)) { //jcb
			return value.length === 16;
		}
		if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { //jcb
			return value.length === 15;
		}
		if (validTypes & 0x0080) { //unknown
			return true;
		}
		return false;
	}, "Please enter a valid credit card number.");

	/**
	 * Validates currencies with any given symbols by @jameslouiz
	 * Symbols can be optional or required. Symbols required by default
	 *
	 * Usage examples:
	 *  currency: ["£", false] - Use false for soft currency validation
	 *  currency: ["$", false]
	 *  currency: ["RM", false] - also works with text based symbols such as "RM" - Malaysia Ringgit etc
	 *
	 *  <input class="currencyInput" name="currencyInput">
	 *
	 * Soft symbol checking
	 *  currencyInput: {
	 *     currency: ["$", false]
	 *  }
	 *
	 * Strict symbol checking (default)
	 *  currencyInput: {
	 *     currency: "$"
	 *     //OR
	 *     currency: ["$", true]
	 *  }
	 *
	 * Multiple Symbols
	 *  currencyInput: {
	 *     currency: "$,£,¢"
	 *  }
	 */
	$.validator.addMethod("currency", function(value, element, param) {
	    var isParamString = typeof param === "string",
	        symbol = isParamString ? param : param[0],
	        soft = isParamString ? true : param[1],
	        regex;

	    symbol = symbol.replace(/,/g, "");
	    symbol = soft ? symbol + "]" : symbol + "]?";
	    regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$";
	    regex = new RegExp(regex);
	    return this.optional(element) || regex.test(value);

	}, "Please specify a valid currency");

	$.validator.addMethod("dateFA", function(value, element) {
		return this.optional(element) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(value);
	}, $.validator.messages.date);

	/**
	 * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
	 *
	 * @example $.validator.methods.date("01/01/1900")
	 * @result true
	 *
	 * @example $.validator.methods.date("01/13/1990")
	 * @result false
	 *
	 * @example $.validator.methods.date("01.01.1900")
	 * @result false
	 *
	 * @example <input name="pippo" class="{dateITA:true}" />
	 * @desc Declares an optional input element whose value must be a valid date.
	 *
	 * @name $.validator.methods.dateITA
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	$.validator.addMethod("dateITA", function(value, element) {
		var check = false,
			re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
			adata, gg, mm, aaaa, xdata;
		if ( re.test(value)) {
			adata = value.split("/");
			gg = parseInt(adata[0], 10);
			mm = parseInt(adata[1], 10);
			aaaa = parseInt(adata[2], 10);
			xdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
			if ( ( xdata.getUTCFullYear() === aaaa ) && ( xdata.getUTCMonth () === mm - 1 ) && ( xdata.getUTCDate() === gg ) ) {
				check = true;
			} else {
				check = false;
			}
		} else {
			check = false;
		}
		return this.optional(element) || check;
	}, $.validator.messages.date);

	$.validator.addMethod("dateNL", function(value, element) {
		return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
	}, $.validator.messages.date);

	// Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
	$.validator.addMethod("extension", function(value, element, param) {
		param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
		return this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
	}, $.validator.format("Please enter a value with a valid extension."));

	/**
	 * Dutch giro account numbers (not bank numbers) have max 7 digits
	 */
	$.validator.addMethod("giroaccountNL", function(value, element) {
		return this.optional(element) || /^[0-9]{1,7}$/.test(value);
	}, "Please specify a valid giro account number");

	/**
	 * IBAN is the international bank account number.
	 * It has a country - specific format, that is checked here too
	 */
	$.validator.addMethod("iban", function(value, element) {
		// some quick simple tests to prevent needless work
		if (this.optional(element)) {
			return true;
		}

		// remove spaces and to upper case
		var iban = value.replace(/ /g, "").toUpperCase(),
			ibancheckdigits = "",
			leadingZeroes = true,
			cRest = "",
			cOperator = "",
			countrycode, ibancheck, charAt, cChar, bbanpattern, bbancountrypatterns, ibanregexp, i, p;

		// check the country code and find the country specific format
		countrycode = iban.substring(0, 2);
		bbancountrypatterns = {
			"AL": "\\d{8}[\\dA-Z]{16}",
			"AD": "\\d{8}[\\dA-Z]{12}",
			"AT": "\\d{16}",
			"AZ": "[\\dA-Z]{4}\\d{20}",
			"BE": "\\d{12}",
			"BH": "[A-Z]{4}[\\dA-Z]{14}",
			"BA": "\\d{16}",
			"BR": "\\d{23}[A-Z][\\dA-Z]",
			"BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
			"CR": "\\d{17}",
			"HR": "\\d{17}",
			"CY": "\\d{8}[\\dA-Z]{16}",
			"CZ": "\\d{20}",
			"DK": "\\d{14}",
			"DO": "[A-Z]{4}\\d{20}",
			"EE": "\\d{16}",
			"FO": "\\d{14}",
			"FI": "\\d{14}",
			"FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
			"GE": "[\\dA-Z]{2}\\d{16}",
			"DE": "\\d{18}",
			"GI": "[A-Z]{4}[\\dA-Z]{15}",
			"GR": "\\d{7}[\\dA-Z]{16}",
			"GL": "\\d{14}",
			"GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
			"HU": "\\d{24}",
			"IS": "\\d{22}",
			"IE": "[\\dA-Z]{4}\\d{14}",
			"IL": "\\d{19}",
			"IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
			"KZ": "\\d{3}[\\dA-Z]{13}",
			"KW": "[A-Z]{4}[\\dA-Z]{22}",
			"LV": "[A-Z]{4}[\\dA-Z]{13}",
			"LB": "\\d{4}[\\dA-Z]{20}",
			"LI": "\\d{5}[\\dA-Z]{12}",
			"LT": "\\d{16}",
			"LU": "\\d{3}[\\dA-Z]{13}",
			"MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
			"MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
			"MR": "\\d{23}",
			"MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
			"MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
			"MD": "[\\dA-Z]{2}\\d{18}",
			"ME": "\\d{18}",
			"NL": "[A-Z]{4}\\d{10}",
			"NO": "\\d{11}",
			"PK": "[\\dA-Z]{4}\\d{16}",
			"PS": "[\\dA-Z]{4}\\d{21}",
			"PL": "\\d{24}",
			"PT": "\\d{21}",
			"RO": "[A-Z]{4}[\\dA-Z]{16}",
			"SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
			"SA": "\\d{2}[\\dA-Z]{18}",
			"RS": "\\d{18}",
			"SK": "\\d{20}",
			"SI": "\\d{15}",
			"ES": "\\d{20}",
			"SE": "\\d{20}",
			"CH": "\\d{5}[\\dA-Z]{12}",
			"TN": "\\d{20}",
			"TR": "\\d{5}[\\dA-Z]{17}",
			"AE": "\\d{3}\\d{16}",
			"GB": "[A-Z]{4}\\d{14}",
			"VG": "[\\dA-Z]{4}\\d{16}"
		};

		bbanpattern = bbancountrypatterns[countrycode];
		// As new countries will start using IBAN in the
		// future, we only check if the countrycode is known.
		// This prevents false negatives, while almost all
		// false positives introduced by this, will be caught
		// by the checksum validation below anyway.
		// Strict checking should return FALSE for unknown
		// countries.
		if (typeof bbanpattern !== "undefined") {
			ibanregexp = new RegExp("^[A-Z]{2}\\d{2}" + bbanpattern + "$", "");
			if (!(ibanregexp.test(iban))) {
				return false; // invalid country specific format
			}
		}

		// now check the checksum, first convert to digits
		ibancheck = iban.substring(4, iban.length) + iban.substring(0, 4);
		for (i = 0; i < ibancheck.length; i++) {
			charAt = ibancheck.charAt(i);
			if (charAt !== "0") {
				leadingZeroes = false;
			}
			if (!leadingZeroes) {
				ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);
			}
		}

		// calculate the result of: ibancheckdigits % 97
		for (p = 0; p < ibancheckdigits.length; p++) {
			cChar = ibancheckdigits.charAt(p);
			cOperator = "" + cRest + "" + cChar;
			cRest = cOperator % 97;
		}
		return cRest === 1;
	}, "Please specify a valid IBAN");

	$.validator.addMethod("integer", function(value, element) {
		return this.optional(element) || /^-?\d+$/.test(value);
	}, "A positive or negative non-decimal number please");

	$.validator.addMethod("ipv4", function(value, element) {
		return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
	}, "Please enter a valid IP v4 address.");

	$.validator.addMethod("ipv6", function(value, element) {
		return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
	}, "Please enter a valid IP v6 address.");

	$.validator.addMethod("lettersonly", function(value, element) {
		return this.optional(element) || /^[a-z]+$/i.test(value);
	}, "Letters only please");

	$.validator.addMethod("letterswithbasicpunc", function(value, element) {
		return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
	}, "Letters or punctuation only please");

	$.validator.addMethod("mobileNL", function(value, element) {
		return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
	}, "Please specify a valid mobile number");

	/* For UK phone functions, do the following server side processing:
	 * Compare original input with this RegEx pattern:
	 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
	 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
	 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
	 * A number of very detailed GB telephone number RegEx patterns can also be found at:
	 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
	 */
	$.validator.addMethod("mobileUK", function(phone_number, element) {
		phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
	}, "Please specify a valid mobile number");

	/*
	 * The número de identidad de extranjero ( NIE )is a code used to identify the non-nationals in Spain
	 */
	$.validator.addMethod( "nieES", function( value ) {
		"use strict";

		value = value.toUpperCase();

		// Basic format test
		if ( !value.match( "((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)" ) ) {
			return false;
		}

		// Test NIE
		//T
		if ( /^[T]{1}/.test( value ) ) {
			return ( value[ 8 ] === /^[T]{1}[A-Z0-9]{8}$/.test( value ) );
		}

		//XYZ
		if ( /^[XYZ]{1}/.test( value ) ) {
			return (
				value[ 8 ] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(
					value.replace( "X", "0" )
						.replace( "Y", "1" )
						.replace( "Z", "2" )
						.substring( 0, 8 ) % 23
				)
			);
		}

		return false;

	}, "Please specify a valid NIE number." );

	/*
	 * The Número de Identificación Fiscal ( NIF ) is the way tax identification used in Spain for individuals
	 */
	$.validator.addMethod( "nifES", function( value ) {
		"use strict";

		value = value.toUpperCase();

		// Basic format test
		if ( !value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)") ) {
			return false;
		}

		// Test NIF
		if ( /^[0-9]{8}[A-Z]{1}$/.test( value ) ) {
			return ( "TRWAGMYFPDXBNJZSQVHLCKE".charAt( value.substring( 8, 0 ) % 23 ) === value.charAt( 8 ) );
		}
		// Test specials NIF (starts with K, L or M)
		if ( /^[KLM]{1}/.test( value ) ) {
			return ( value[ 8 ] === String.fromCharCode( 64 ) );
		}

		return false;

	}, "Please specify a valid NIF number." );

	jQuery.validator.addMethod( "notEqualTo", function( value, element, param ) {
		return this.optional(element) || !$.validator.methods.equalTo.call( this, value, element, param );
	}, "Please enter a different value, values must not be the same." );

	$.validator.addMethod("nowhitespace", function(value, element) {
		return this.optional(element) || /^\S+$/i.test(value);
	}, "No white space please");

	/**
	* Return true if the field value matches the given format RegExp
	*
	* @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
	* @result true
	*
	* @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
	* @result false
	*
	* @name $.validator.methods.pattern
	* @type Boolean
	* @cat Plugins/Validate/Methods
	*/
	$.validator.addMethod("pattern", function(value, element, param) {
		if (this.optional(element)) {
			return true;
		}
		if (typeof param === "string") {
			param = new RegExp("^(?:" + param + ")$");
		}
		return param.test(value);
	}, "Invalid format.");

	/**
	 * Dutch phone numbers have 10 digits (or 11 and start with +31).
	 */
	$.validator.addMethod("phoneNL", function(value, element) {
		return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
	}, "Please specify a valid phone number.");

	/* For UK phone functions, do the following server side processing:
	 * Compare original input with this RegEx pattern:
	 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
	 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
	 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
	 * A number of very detailed GB telephone number RegEx patterns can also be found at:
	 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
	 */
	$.validator.addMethod("phoneUK", function(phone_number, element) {
		phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
	}, "Please specify a valid phone number");

	/**
	 * matches US phone number format
	 *
	 * where the area code may not start with 1 and the prefix may not start with 1
	 * allows '-' or ' ' as a separator and allows parens around area code
	 * some people may want to put a '1' in front of their number
	 *
	 * 1(212)-999-2345 or
	 * 212 999 2344 or
	 * 212-999-0983
	 *
	 * but not
	 * 111-123-5434
	 * and not
	 * 212 123 4567
	 */
	$.validator.addMethod("phoneUS", function(phone_number, element) {
		phone_number = phone_number.replace(/\s+/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
	}, "Please specify a valid phone number");

	/* For UK phone functions, do the following server side processing:
	 * Compare original input with this RegEx pattern:
	 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
	 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
	 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
	 * A number of very detailed GB telephone number RegEx patterns can also be found at:
	 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
	 */
	//Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers
	$.validator.addMethod("phonesUK", function(phone_number, element) {
		phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
		return this.optional(element) || phone_number.length > 9 &&
			phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/);
	}, "Please specify a valid uk phone number");

	/**
	 * Matches a valid Canadian Postal Code
	 *
	 * @example jQuery.validator.methods.postalCodeCA( "H0H 0H0", element )
	 * @result true
	 *
	 * @example jQuery.validator.methods.postalCodeCA( "H0H0H0", element )
	 * @result false
	 *
	 * @name jQuery.validator.methods.postalCodeCA
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	$.validator.addMethod( "postalCodeCA", function( value, element ) {
		return this.optional( element ) || /^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/.test( value );
	}, "Please specify a valid postal code" );

	/*
	* Valida CEPs do brasileiros:
	*
	* Formatos aceitos:
	* 99999-999
	* 99.999-999
	* 99999999
	*/
	$.validator.addMethod("postalcodeBR", function(cep_value, element) {
		return this.optional(element) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test( cep_value );
	}, "Informe um CEP válido.");

	/* Matches Italian postcode (CAP) */
	$.validator.addMethod("postalcodeIT", function(value, element) {
		return this.optional(element) || /^\d{5}$/.test(value);
	}, "Please specify a valid postal code");

	$.validator.addMethod("postalcodeNL", function(value, element) {
		return this.optional(element) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value);
	}, "Please specify a valid postal code");

	// Matches UK postcode. Does not match to UK Channel Islands that have their own postcodes (non standard UK)
	$.validator.addMethod("postcodeUK", function(value, element) {
		return this.optional(element) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(value);
	}, "Please specify a valid UK postcode");

	/*
	 * Lets you say "at least X inputs that match selector Y must be filled."
	 *
	 * The end result is that neither of these inputs:
	 *
	 *	<input class="productinfo" name="partnumber">
	 *	<input class="productinfo" name="description">
	 *
	 *	...will validate unless at least one of them is filled.
	 *
	 * partnumber:	{require_from_group: [1,".productinfo"]},
	 * description: {require_from_group: [1,".productinfo"]}
	 *
	 * options[0]: number of fields that must be filled in the group
	 * options[1]: CSS selector that defines the group of conditionally required fields
	 */
	$.validator.addMethod("require_from_group", function(value, element, options) {
		var $fields = $(options[1], element.form),
			$fieldsFirst = $fields.eq(0),
			validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this),
			isValid = $fields.filter(function() {
				return validator.elementValue(this);
			}).length >= options[0];

		// Store the cloned validator for future validation
		$fieldsFirst.data("valid_req_grp", validator);

		// If element isn't being validated, run each require_from_group field's validation rules
		if (!$(element).data("being_validated")) {
			$fields.data("being_validated", true);
			$fields.each(function() {
				validator.element(this);
			});
			$fields.data("being_validated", false);
		}
		return isValid;
	}, $.validator.format("Please fill at least {0} of these fields."));

	/*
	 * Lets you say "either at least X inputs that match selector Y must be filled,
	 * OR they must all be skipped (left blank)."
	 *
	 * The end result, is that none of these inputs:
	 *
	 *	<input class="productinfo" name="partnumber">
	 *	<input class="productinfo" name="description">
	 *	<input class="productinfo" name="color">
	 *
	 *	...will validate unless either at least two of them are filled,
	 *	OR none of them are.
	 *
	 * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
	 * description: {skip_or_fill_minimum: [2,".productinfo"]},
	 * color:		{skip_or_fill_minimum: [2,".productinfo"]}
	 *
	 * options[0]: number of fields that must be filled in the group
	 * options[1]: CSS selector that defines the group of conditionally required fields
	 *
	 */
	$.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
		var $fields = $(options[1], element.form),
			$fieldsFirst = $fields.eq(0),
			validator = $fieldsFirst.data("valid_skip") ? $fieldsFirst.data("valid_skip") : $.extend({}, this),
			numberFilled = $fields.filter(function() {
				return validator.elementValue(this);
			}).length,
			isValid = numberFilled === 0 || numberFilled >= options[0];

		// Store the cloned validator for future validation
		$fieldsFirst.data("valid_skip", validator);

		// If element isn't being validated, run each skip_or_fill_minimum field's validation rules
		if (!$(element).data("being_validated")) {
			$fields.data("being_validated", true);
			$fields.each(function() {
				validator.element(this);
			});
			$fields.data("being_validated", false);
		}
		return isValid;
	}, $.validator.format("Please either skip these fields or fill at least {0} of them."));

	/* Validates US States and/or Territories by @jdforsythe
	 * Can be case insensitive or require capitalization - default is case insensitive
	 * Can include US Territories or not - default does not
	 * Can include US Military postal abbreviations (AA, AE, AP) - default does not
	 *
	 * Note: "States" always includes DC (District of Colombia)
	 *
	 * Usage examples:
	 *
	 *  This is the default - case insensitive, no territories, no military zones
	 *  stateInput: {
	 *     caseSensitive: false,
	 *     includeTerritories: false,
	 *     includeMilitary: false
	 *  }
	 *
	 *  Only allow capital letters, no territories, no military zones
	 *  stateInput: {
	 *     caseSensitive: false
	 *  }
	 *
	 *  Case insensitive, include territories but not military zones
	 *  stateInput: {
	 *     includeTerritories: true
	 *  }
	 *
	 *  Only allow capital letters, include territories and military zones
	 *  stateInput: {
	 *     caseSensitive: true,
	 *     includeTerritories: true,
	 *     includeMilitary: true
	 *  }
	 *
	 *
	 *
	 */

	$.validator.addMethod("stateUS", function(value, element, options) {
		var isDefault = typeof options === "undefined",
			caseSensitive = ( isDefault || typeof options.caseSensitive === "undefined" ) ? false : options.caseSensitive,
			includeTerritories = ( isDefault || typeof options.includeTerritories === "undefined" ) ? false : options.includeTerritories,
			includeMilitary = ( isDefault || typeof options.includeMilitary === "undefined" ) ? false : options.includeMilitary,
			regex;

		if (!includeTerritories && !includeMilitary) {
			regex = "^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
		} else if (includeTerritories && includeMilitary) {
			regex = "^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
		} else if (includeTerritories) {
			regex = "^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
		} else {
			regex = "^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
		}

		regex = caseSensitive ? new RegExp(regex) : new RegExp(regex, "i");
		return this.optional(element) || regex.test(value);
	},
	"Please specify a valid state");

	// TODO check if value starts with <, otherwise don't try stripping anything
	$.validator.addMethod("strippedminlength", function(value, element, param) {
		return $(value).text().length >= param;
	}, $.validator.format("Please enter at least {0} characters"));

	$.validator.addMethod("time", function(value, element) {
		return this.optional(element) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(value);
	}, "Please enter a valid time, between 00:00 and 23:59");

	$.validator.addMethod("time12h", function(value, element) {
		return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
	}, "Please enter a valid time in 12-hour am/pm format");

	// same as url, but TLD is optional
	$.validator.addMethod("url2", function(value, element) {
		return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
	}, $.validator.messages.url);

	/**
	 * Return true, if the value is a valid vehicle identification number (VIN).
	 *
	 * Works with all kind of text inputs.
	 *
	 * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
	 * @desc Declares a required input element whose value must be a valid vehicle identification number.
	 *
	 * @name $.validator.methods.vinUS
	 * @type Boolean
	 * @cat Plugins/Validate/Methods
	 */
	$.validator.addMethod("vinUS", function(v) {
		if (v.length !== 17) {
			return false;
		}

		var LL = [ "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ],
			VL = [ 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9 ],
			FL = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ],
			rs = 0,
			i, n, d, f, cd, cdv;

		for (i = 0; i < 17; i++) {
			f = FL[i];
			d = v.slice(i, i + 1);
			if (i === 8) {
				cdv = d;
			}
			if (!isNaN(d)) {
				d *= f;
			} else {
				for (n = 0; n < LL.length; n++) {
					if (d.toUpperCase() === LL[n]) {
						d = VL[n];
						d *= f;
						if (isNaN(cdv) && n === 8) {
							cdv = LL[n];
						}
						break;
					}
				}
			}
			rs += d;
		}
		cd = rs % 11;
		if (cd === 10) {
			cd = "X";
		}
		if (cd === cdv) {
			return true;
		}
		return false;
	}, "The specified vehicle identification number (VIN) is invalid.");

	$.validator.addMethod("zipcodeUS", function(value, element) {
		return this.optional(element) || /^\d{5}(-\d{4})?$/.test(value);
	}, "The specified US ZIP Code is invalid");

	$.validator.addMethod("ziprange", function(value, element) {
		return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
	}, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx");

	}));efine&&define.amd?define(["jquery","./jquery.validate.min"],a):a(jQuery)}(function(a){!function(){function b(a){return a.replace(/<.[^<>]*?>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g,"")}a.validator.addMethod("maxWords",function(a,c,d){return this.optional(c)||b(a).match(/\b\w+\b/g).length<=d},a.validator.format("Please enter {0} words or less.")),a.validator.addMethod("minWords",function(a,c,d){return this.optional(c)||b(a).match(/\b\w+\b/g).length>=d},a.validator.format("Please enter at least {0} words.")),a.validator.addMethod("rangeWords",function(a,c,d){var e=b(a),f=/\b\w+\b/g;return this.optional(c)||e.match(f).length>=d[0]&&e.match(f).length<=d[1]},a.validator.format("Please enter between {0} and {1} words."))}(),a.validator.addMethod("accept",function(b,c,d){var e,f,g="string"==typeof d?d.replace(/\s/g,"").replace(/,/g,"|"):"image/*",h=this.optional(c);if(h)return h;if("file"===a(c).attr("type")&&(g=g.replace(/\*/g,".*"),c.files&&c.files.length))for(e=0;e<c.files.length;e++)if(f=c.files[e],!f.type.match(new RegExp("\\.?("+g+")$","i")))return!1;return!0},a.validator.format("Please enter a value with a valid mimetype.")),a.validator.addMethod("alphanumeric",function(a,b){return this.optional(b)||/^\w+$/i.test(a)},"Letters, numbers, and underscores only please"),a.validator.addMethod("bankaccountNL",function(a,b){if(this.optional(b))return!0;if(!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(a))return!1;var c,d,e,f=a.replace(/ /g,""),g=0,h=f.length;for(c=0;h>c;c++)d=h-c,e=f.substring(c,c+1),g+=d*e;return g%11===0},"Please specify a valid bank account number"),a.validator.addMethod("bankorgiroaccountNL",function(b,c){return this.optional(c)||a.validator.methods.bankaccountNL.call(this,b,c)||a.validator.methods.giroaccountNL.call(this,b,c)},"Please specify a valid bank or giro account number"),a.validator.addMethod("bic",function(a,b){return this.optional(b)||/^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(a)},"Please specify a valid BIC code"),a.validator.addMethod("cifES",function(a){"use strict";var b,c,d,e,f,g,h=[];if(a=a.toUpperCase(),!a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)"))return!1;for(d=0;9>d;d++)h[d]=parseInt(a.charAt(d),10);for(c=h[2]+h[4]+h[6],e=1;8>e;e+=2)f=(2*h[e]).toString(),g=f.charAt(1),c+=parseInt(f.charAt(0),10)+(""===g?0:parseInt(g,10));return/^[ABCDEFGHJNPQRSUVW]{1}/.test(a)?(c+="",b=10-parseInt(c.charAt(c.length-1),10),a+=b,h[8].toString()===String.fromCharCode(64+b)||h[8].toString()===a.charAt(a.length-1)):!1},"Please specify a valid CIF number."),a.validator.addMethod("cpfBR",function(a){if(a=a.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g,""),11!==a.length)return!1;var b,c,d,e,f=0;if(b=parseInt(a.substring(9,10),10),c=parseInt(a.substring(10,11),10),d=function(a,b){var c=10*a%11;return(10===c||11===c)&&(c=0),c===b},""===a||"00000000000"===a||"11111111111"===a||"22222222222"===a||"33333333333"===a||"44444444444"===a||"55555555555"===a||"66666666666"===a||"77777777777"===a||"88888888888"===a||"99999999999"===a)return!1;for(e=1;9>=e;e++)f+=parseInt(a.substring(e-1,e),10)*(11-e);if(d(f,b)){for(f=0,e=1;10>=e;e++)f+=parseInt(a.substring(e-1,e),10)*(12-e);return d(f,c)}return!1},"Please specify a valid CPF number"),a.validator.addMethod("creditcardtypes",function(a,b,c){if(/[^0-9\-]+/.test(a))return!1;a=a.replace(/\D/g,"");var d=0;return c.mastercard&&(d|=1),c.visa&&(d|=2),c.amex&&(d|=4),c.dinersclub&&(d|=8),c.enroute&&(d|=16),c.discover&&(d|=32),c.jcb&&(d|=64),c.unknown&&(d|=128),c.all&&(d=255),1&d&&/^(5[12345])/.test(a)?16===a.length:2&d&&/^(4)/.test(a)?16===a.length:4&d&&/^(3[47])/.test(a)?15===a.length:8&d&&/^(3(0[012345]|[68]))/.test(a)?14===a.length:16&d&&/^(2(014|149))/.test(a)?15===a.length:32&d&&/^(6011)/.test(a)?16===a.length:64&d&&/^(3)/.test(a)?16===a.length:64&d&&/^(2131|1800)/.test(a)?15===a.length:128&d?!0:!1},"Please enter a valid credit card number."),a.validator.addMethod("currency",function(a,b,c){var d,e="string"==typeof c,f=e?c:c[0],g=e?!0:c[1];return f=f.replace(/,/g,""),f=g?f+"]":f+"]?",d="^["+f+"([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$",d=new RegExp(d),this.optional(b)||d.test(a)},"Please specify a valid currency"),a.validator.addMethod("dateFA",function(a,b){return this.optional(b)||/^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(a)},a.validator.messages.date),a.validator.addMethod("dateITA",function(a,b){var c,d,e,f,g,h=!1,i=/^\d{1,2}\/\d{1,2}\/\d{4}$/;return i.test(a)?(c=a.split("/"),d=parseInt(c[0],10),e=parseInt(c[1],10),f=parseInt(c[2],10),g=new Date(Date.UTC(f,e-1,d,12,0,0,0)),h=g.getUTCFullYear()===f&&g.getUTCMonth()===e-1&&g.getUTCDate()===d?!0:!1):h=!1,this.optional(b)||h},a.validator.messages.date),a.validator.addMethod("dateNL",function(a,b){return this.optional(b)||/^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(a)},a.validator.messages.date),a.validator.addMethod("extension",function(a,b,c){return c="string"==typeof c?c.replace(/,/g,"|"):"png|jpe?g|gif",this.optional(b)||a.match(new RegExp("\\.("+c+")$","i"))},a.validator.format("Please enter a value with a valid extension.")),a.validator.addMethod("giroaccountNL",function(a,b){return this.optional(b)||/^[0-9]{1,7}$/.test(a)},"Please specify a valid giro account number"),a.validator.addMethod("iban",function(a,b){if(this.optional(b))return!0;var c,d,e,f,g,h,i,j,k,l=a.replace(/ /g,"").toUpperCase(),m="",n=!0,o="",p="";if(c=l.substring(0,2),h={AL:"\\d{8}[\\dA-Z]{16}",AD:"\\d{8}[\\dA-Z]{12}",AT:"\\d{16}",AZ:"[\\dA-Z]{4}\\d{20}",BE:"\\d{12}",BH:"[A-Z]{4}[\\dA-Z]{14}",BA:"\\d{16}",BR:"\\d{23}[A-Z][\\dA-Z]",BG:"[A-Z]{4}\\d{6}[\\dA-Z]{8}",CR:"\\d{17}",HR:"\\d{17}",CY:"\\d{8}[\\dA-Z]{16}",CZ:"\\d{20}",DK:"\\d{14}",DO:"[A-Z]{4}\\d{20}",EE:"\\d{16}",FO:"\\d{14}",FI:"\\d{14}",FR:"\\d{10}[\\dA-Z]{11}\\d{2}",GE:"[\\dA-Z]{2}\\d{16}",DE:"\\d{18}",GI:"[A-Z]{4}[\\dA-Z]{15}",GR:"\\d{7}[\\dA-Z]{16}",GL:"\\d{14}",GT:"[\\dA-Z]{4}[\\dA-Z]{20}",HU:"\\d{24}",IS:"\\d{22}",IE:"[\\dA-Z]{4}\\d{14}",IL:"\\d{19}",IT:"[A-Z]\\d{10}[\\dA-Z]{12}",KZ:"\\d{3}[\\dA-Z]{13}",KW:"[A-Z]{4}[\\dA-Z]{22}",LV:"[A-Z]{4}[\\dA-Z]{13}",LB:"\\d{4}[\\dA-Z]{20}",LI:"\\d{5}[\\dA-Z]{12}",LT:"\\d{16}",LU:"\\d{3}[\\dA-Z]{13}",MK:"\\d{3}[\\dA-Z]{10}\\d{2}",MT:"[A-Z]{4}\\d{5}[\\dA-Z]{18}",MR:"\\d{23}",MU:"[A-Z]{4}\\d{19}[A-Z]{3}",MC:"\\d{10}[\\dA-Z]{11}\\d{2}",MD:"[\\dA-Z]{2}\\d{18}",ME:"\\d{18}",NL:"[A-Z]{4}\\d{10}",NO:"\\d{11}",PK:"[\\dA-Z]{4}\\d{16}",PS:"[\\dA-Z]{4}\\d{21}",PL:"\\d{24}",PT:"\\d{21}",RO:"[A-Z]{4}[\\dA-Z]{16}",SM:"[A-Z]\\d{10}[\\dA-Z]{12}",SA:"\\d{2}[\\dA-Z]{18}",RS:"\\d{18}",SK:"\\d{20}",SI:"\\d{15}",ES:"\\d{20}",SE:"\\d{20}",CH:"\\d{5}[\\dA-Z]{12}",TN:"\\d{20}",TR:"\\d{5}[\\dA-Z]{17}",AE:"\\d{3}\\d{16}",GB:"[A-Z]{4}\\d{14}",VG:"[\\dA-Z]{4}\\d{16}"},g=h[c],"undefined"!=typeof g&&(i=new RegExp("^[A-Z]{2}\\d{2}"+g+"$",""),!i.test(l)))return!1;for(d=l.substring(4,l.length)+l.substring(0,4),j=0;j<d.length;j++)e=d.charAt(j),"0"!==e&&(n=!1),n||(m+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(e));for(k=0;k<m.length;k++)f=m.charAt(k),p=""+o+f,o=p%97;return 1===o},"Please specify a valid IBAN"),a.validator.addMethod("integer",function(a,b){return this.optional(b)||/^-?\d+$/.test(a)},"A positive or negative non-decimal number please"),a.validator.addMethod("ipv4",function(a,b){return this.optional(b)||/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(a)},"Please enter a valid IP v4 address."),a.validator.addMethod("ipv6",function(a,b){return this.optional(b)||/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(a)},"Please enter a valid IP v6 address."),a.validator.addMethod("lettersonly",function(a,b){return this.optional(b)||/^[a-z]+$/i.test(a)},"Letters only please"),a.validator.addMethod("letterswithbasicpunc",function(a,b){return this.optional(b)||/^[a-z\-.,()'"\s]+$/i.test(a)},"Letters or punctuation only please"),a.validator.addMethod("mobileNL",function(a,b){return this.optional(b)||/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(a)},"Please specify a valid mobile number"),a.validator.addMethod("mobileUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/)},"Please specify a valid mobile number"),a.validator.addMethod("nieES",function(a){"use strict";return a=a.toUpperCase(),a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")?/^[T]{1}/.test(a)?a[8]===/^[T]{1}[A-Z0-9]{8}$/.test(a):/^[XYZ]{1}/.test(a)?a[8]==="TRWAGMYFPDXBNJZSQVHLCKE".charAt(a.replace("X","0").replace("Y","1").replace("Z","2").substring(0,8)%23):!1:!1},"Please specify a valid NIE number."),a.validator.addMethod("nifES",function(a){"use strict";return a=a.toUpperCase(),a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")?/^[0-9]{8}[A-Z]{1}$/.test(a)?"TRWAGMYFPDXBNJZSQVHLCKE".charAt(a.substring(8,0)%23)===a.charAt(8):/^[KLM]{1}/.test(a)?a[8]===String.fromCharCode(64):!1:!1},"Please specify a valid NIF number."),jQuery.validator.addMethod("notEqualTo",function(b,c,d){return this.optional(c)||!a.validator.methods.equalTo.call(this,b,c,d)},"Please enter a different value, values must not be the same."),a.validator.addMethod("nowhitespace",function(a,b){return this.optional(b)||/^\S+$/i.test(a)},"No white space please"),a.validator.addMethod("pattern",function(a,b,c){return this.optional(b)?!0:("string"==typeof c&&(c=new RegExp("^(?:"+c+")$")),c.test(a))},"Invalid format."),a.validator.addMethod("phoneNL",function(a,b){return this.optional(b)||/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(a)},"Please specify a valid phone number."),a.validator.addMethod("phoneUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/)},"Please specify a valid phone number"),a.validator.addMethod("phoneUS",function(a,b){return a=a.replace(/\s+/g,""),this.optional(b)||a.length>9&&a.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/)},"Please specify a valid phone number"),a.validator.addMethod("phonesUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/)},"Please specify a valid uk phone number"),a.validator.addMethod("postalCodeCA",function(a,b){return this.optional(b)||/^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postalcodeBR",function(a,b){return this.optional(b)||/^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(a)},"Informe um CEP válido."),a.validator.addMethod("postalcodeIT",function(a,b){return this.optional(b)||/^\d{5}$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postalcodeNL",function(a,b){return this.optional(b)||/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postcodeUK",function(a,b){return this.optional(b)||/^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(a)},"Please specify a valid UK postcode"),a.validator.addMethod("require_from_group",function(b,c,d){var e=a(d[1],c.form),f=e.eq(0),g=f.data("valid_req_grp")?f.data("valid_req_grp"):a.extend({},this),h=e.filter(function(){return g.elementValue(this)}).length>=d[0];return f.data("valid_req_grp",g),a(c).data("being_validated")||(e.data("being_validated",!0),e.each(function(){g.element(this)}),e.data("being_validated",!1)),h},a.validator.format("Please fill at least {0} of these fields.")),a.validator.addMethod("skip_or_fill_minimum",function(b,c,d){var e=a(d[1],c.form),f=e.eq(0),g=f.data("valid_skip")?f.data("valid_skip"):a.extend({},this),h=e.filter(function(){return g.elementValue(this)}).length,i=0===h||h>=d[0];return f.data("valid_skip",g),a(c).data("being_validated")||(e.data("being_validated",!0),e.each(function(){g.element(this)}),e.data("being_validated",!1)),i},a.validator.format("Please either skip these fields or fill at least {0} of them.")),a.validator.addMethod("stateUS",function(a,b,c){var d,e="undefined"==typeof c,f=e||"undefined"==typeof c.caseSensitive?!1:c.caseSensitive,g=e||"undefined"==typeof c.includeTerritories?!1:c.includeTerritories,h=e||"undefined"==typeof c.includeMilitary?!1:c.includeMilitary;return d=g||h?g&&h?"^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$":g?"^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$":"^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$":"^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$",d=f?new RegExp(d):new RegExp(d,"i"),this.optional(b)||d.test(a)},"Please specify a valid state"),a.validator.addMethod("strippedminlength",function(b,c,d){return a(b).text().length>=d},a.validator.format("Please enter at least {0} characters")),a.validator.addMethod("time",function(a,b){return this.optional(b)||/^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(a)},"Please enter a valid time, between 00:00 and 23:59"),a.validator.addMethod("time12h",function(a,b){return this.optional(b)||/^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(a)},"Please enter a valid time in 12-hour am/pm format"),a.validator.addMethod("url2",function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},a.validator.messages.url),a.validator.addMethod("vinUS",function(a){if(17!==a.length)return!1;var b,c,d,e,f,g,h=["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","U","V","W","X","Y","Z"],i=[1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9],j=[8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2],k=0;for(b=0;17>b;b++){if(e=j[b],d=a.slice(b,b+1),8===b&&(g=d),isNaN(d)){for(c=0;c<h.length;c++)if(d.toUpperCase()===h[c]){d=i[c],d*=e,isNaN(g)&&8===c&&(g=h[c]);break}}else d*=e;k+=d}return f=k%11,10===f&&(f="X"),f===g?!0:!1},"The specified vehicle identification number (VIN) is invalid."),a.validator.addMethod("zipcodeUS",function(a,b){return this.optional(b)||/^\d{5}(-\d{4})?$/.test(a)},"The specified US ZIP Code is invalid"),a.validator.addMethod("ziprange",function(a,b){return this.optional(b)||/^90[2-5]\d\{2\}-\d{4}$/.test(a)},"Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx")});