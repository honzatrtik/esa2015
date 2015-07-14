const typeNames = {
    'RN01': 'Ageing in Europe',
    'RN02': 'Sociology of the Arts',
    'RN03': 'Biographical Perspectives on European Societies',
    'RN04': 'Sociology of Children and Childhood',
    'RN05': 'Sociology of Consumption',
    'RN06': 'Critical Political Economy',
    'RN07': 'Sociology of Culture',
    'RN08': 'Disaster, Conflict and Social Crisis',
    'RN09': 'Economic Sociology',
    'RN10': 'Sociology of Education',
    'RN11': 'Sociology of emotions',
    'RN12': 'Environment and Society',
    'RN13': 'Sociology of Families and Intimate Lives',
    'RN14': 'Gender Relations in the Labour Market and the Welfare State',
    'RN15': 'Global, Transnational and Cosmopolitan Sociology',
    'RN16': 'Sociology of Health and Illness',
    'RN17': 'Work, Employment and Industrial Relations',
    'RN18': 'Sociology of Communications and Media Research',
    'RN19': 'Sociology of Professions',
    'RN20': 'Qualitative Methods',
    'RN21': 'Quantitative Methods',
    'RN22': 'Sociology of Risk and Uncertainty',
    'RN23': 'Sexuality',
    'RN24': 'Science and Technology',
    'RN25': 'Social Movements',
    'RN26': 'Sociology of Social Policy',
    'RN27': 'Regional Network on Southern European Societies',
    'RN28': 'Society and Sports',
    'RN29': 'Social Theory',
    'RN30': 'Youth and Generation',
    'RN31': 'Ethnic Relations, Racism and Antisemitism',
    'RN32': 'Political Sociology',
    'RN33': 'Women’s and Gender Studies',
    'RN34': 'Sociology of Religion',
    'RN35': 'Sociology of Migration',
    'RN36': 'Sociology of Transformations: East and West',
    'RN37': 'Urban Sociology',
    'RS1': ' Arts Management',
    'RS2': 'Design in Use',
    'RS3': 'Europeanization from Below?',
    'RS4': 'Sociology of Celebration',
    'RS5': 'Sociology of Knowledge',
    'RS6': 'Sociology of Morality',
    'RS7': 'Maritime Sociology',
    'SPS': 'Semi-Plenary Sessions',
    'MD': 'Mid-day Specials',
    'SE': 'Special Events',
    'OC': 'Opening Ceremony',
    'CP': 'Closing Plenary'
};

export default {
    dates: ['2015-08-25', '2015-08-26', '2015-08-27', '2015-08-28'],
    dbUrl: process.env.DATABASE_URL + '?ssl=true',
    appUrl: process.env.APP_URL || 'http://127.0.0.1:8080',
    workers: process.env.WEB_CONCURRENCY || 1,
    typeNames
}






