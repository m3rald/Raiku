import { QuizQuestion } from './types';

export const QUESTION_BANK: Record<string, Record<'easy' | 'intermediate' | 'hard', QuizQuestion[]>> = {
  raiku: {
    easy: [
      {
        id: 'r_e1',
        q: 'What is the primary purpose of Raiku on Solana?',
        options: [
          'Running a separate Layer-2 rollup network',
          'Guaranteed and predictable transaction landing',
          'Creating a replacement consensus engine',
          'Offering free transactions for everyone'
        ],
        correct: 1
      },
      {
        id: 'r_e2',
        q: 'What asset represents blockspace auction yield and governance in Raiku?',
        options: ['raikuGAS', 'solRKU', 'rkuSOL', 'rkSOL'],
        correct: 2
      },
      {
        id: 'r_e3',
        q: 'Where does Raiku operate in the Solana network stack?',
        options: [
          'As a coordination and execution enhancement layer',
          'As a replacement for the Solana validator client',
          'At the hardware routing layer',
          'Inside the client-side browser wallet'
        ],
        correct: 0
      },
      {
        id: 'r_e4',
        q: 'What is the standard block time of the Solana network?',
        options: ['100ms', '400ms', '1 second', '2 seconds'],
        correct: 1
      },
      {
        id: 'r_e5',
        q: 'How does Raiku assist regular Solana transactions?',
        options: [
          'By offering priority landing guarantees',
          'By executing them off-chain completely',
          'By locking user accounts permanently',
          'By minifying transaction payloads'
        ],
        correct: 0
      },
      {
        id: 'r_e6',
        q: 'What is the name of Raiku\'s token used for ecosystem rewards?',
        options: ['rkuSOL', 'solRAI', 'rGAS', 'SOL'],
        correct: 0
      },
      {
        id: 'r_e7',
        q: 'What blockchain is Raiku primarily designed for?',
        options: ['Ethereum', 'Bitcoin', 'Solana', 'Avalanche'],
        correct: 2
      },
      {
        id: 'r_e8',
        q: 'How can users connect to Raiku-enhanced RPCs?',
        options: [
          'Seamlessly via standard web3 wallet RPC URLs',
          'Only by installing a specific OS kernel',
          'By mailing a physical storage drive',
          'Via offline text messages'
        ],
        correct: 0
      },
      {
        id: 'r_e9',
        q: 'Who benefits most from Raiku\'s high-reliability routing?',
        options: [
          'Regular users and traders experiencing congestion',
          'Offline paper wallet developers',
          'Archival nodes that never post transactions',
          'Centralized financial banks'
        ],
        correct: 0
      },
      {
        id: 'r_e10',
        q: 'Does Raiku require users to modify their existing Rust smart contracts?',
        options: [
          'Yes, a complete rewrite is mandatory',
          'No, it is fully backward-compatible',
          'Yes, but only for C++ modules',
          'Only when executing during solar eclipses'
        ],
        correct: 1
      }
    ],
    intermediate: [
      {
        id: 'r_i1',
        q: 'What does AOT stand for in Raiku\'s architecture?',
        options: [
          'Active Order Tracking',
          'Ahead-Of-Time compute reservations',
          'Automated On-chain Trading',
          'After Operation Testing'
        ],
        correct: 1
      },
      {
        id: 'r_i2',
        q: 'How are blockspace pre-confirmations delivered by Raiku?',
        options: [
          'In exactly one block time (400ms)',
          'Within 5 to 10 seconds',
          'Typically in sub-50 milliseconds',
          'After epoch boundaries'
        ],
        correct: 2
      },
      {
        id: 'r_i3',
        q: 'What is the Raiku Blockspace Marketplace?',
        options: [
          'A decentralized auction where protocols secure future execution slots',
          'A place to buy and sell NFTs',
          'A validator cloud hosting service',
          'A token launchpad for memecoins'
        ],
        correct: 0
      },
      {
        id: 'r_i4',
        q: 'How does Raiku incentivize Solana Validators?',
        options: [
          'By sharing revenue from blockspace auctions and AOT fees',
          'By inflating the SOL token supply',
          'By charging participants a flat validator tax',
          'By penalizing non-Raiku validators'
        ],
        correct: 0
      },
      {
        id: 'r_i5',
        q: 'What mechanism does Raiku use to prevent frontrunning?',
        options: [
          'Secure, encrypted transaction propagation channels',
          'Halting the network when high volume is detected',
          'Forcing manual human captcha for every transaction',
          'Reordering transactions alphabetically'
        ],
        correct: 0
      },
      {
        id: 'r_i6',
        q: 'What does Raiku\'s MEV protection feature do?',
        options: [
          'It shields users from sandwich attacks and backrunning',
          'It mints new governance tokens for validators',
          'It deletes failing transactions automatically',
          'It translates smart contracts to English'
        ],
        correct: 0
      },
      {
        id: 'r_i7',
        q: 'Which Solana RPC API method does Raiku intercept and optimize?',
        options: ['sendTransaction', 'getAccountInfo', 'getBalance', 'getEpochInfo'],
        correct: 0
      },
      {
        id: 'r_i8',
        q: 'How does Raiku handle network forks?',
        options: [
          'By maintaining multi-validator state consensus',
          'By terminating the system instantly',
          'By splitting the rkuSOL token into two',
          'By requesting manual human arbitration'
        ],
        correct: 0
      },
      {
        id: 'r_i9',
        q: 'What is the benefit of Raiku\'s custom scheduler for validators?',
        options: [
          'It schedules high-priority transactions optimally',
          'It schedules validator breaks and vacations',
          'It formats transaction timestamps to local time',
          'It reduces power consumption to zero'
        ],
        correct: 0
      },
      {
        id: 'r_i10',
        q: 'How does Raiku\'s fee structure compare to standard Solana fees?',
        options: [
          'It adds a tiny premium for absolute execution guarantees',
          'It is 100 times cheaper than standard gas',
          'It is strictly free',
          'It requires payment in physical gold'
        ],
        correct: 0
      }
    ],
    hard: [
      {
        id: 'r_h1',
        q: 'In Raiku’s auction engine, what bidding algorithm is used for blockspace allocation?',
        options: [
          'A modified Dutch auction with blind reserve pricing',
          'A first-price sealed-bid english system',
          'A round-robin lottery pool',
          'A manual peer-to-peer bartering system'
        ],
        correct: 0
      },
      {
        id: 'r_h2',
        q: 'How does Raiku\'s Ahead-Of-Time (AOT) reservation avoid starvation of non-paying transactions?',
        options: [
          'By reserving a maximum of 40% of the block\'s compute units for premium slots',
          'By requiring all standard transactions to use Layer-2 rollups',
          'By executing AOT reservations on a separate sidechain',
          'By forcing validators to work overtime'
        ],
        correct: 0
      },
      {
        id: 'r_h3',
        q: 'What cryptographic scheme is utilized by Raiku for transaction pre-confirmations?',
        options: [
          'BLS multi-signatures across the validator subset',
          'RSA-2048 encryption with public key exchange',
          'SHA-256 brute force proof',
          'Zero-knowledge Snarks without trusted setups'
        ],
        correct: 0
      },
      {
        id: 'r_h4',
        q: 'How does Raiku handle late-arriving transactions in its private propagation network?',
        options: [
          'It queues them for the subsequent slot with dynamic fee escalation',
          'It drops them instantly with no refund',
          'It forks the blockchain to force them into the block',
          'It processes them out-of-band using email'
        ],
        correct: 0
      },
      {
        id: 'r_h5',
        q: 'What is the role of "Searchers" within Raiku\'s blockspace ecosystem?',
        options: [
          'To arbitrage price discrepancies across pre-reserved execution states',
          'To look for lost wallet seeds on public forums',
          'To index blocks on Google Search engine',
          'To monitor validator server temperature'
        ],
        correct: 0
      },
      {
        id: 'r_h6',
        q: 'How does Raiku verify validator compliance with slot allocation agreements?',
        options: [
          'Through optimistic on-chain slashing and proof-of-execution challenges',
          'By requiring a physical webcam on the validator servers',
          'Through random phone audits by Raiku core developers',
          'By checking the validator\'s Twitter activity'
        ],
        correct: 0
      },
      {
        id: 'r_h7',
        q: 'What Solana transaction feature does Raiku\'s scheduler exploit to parallelize execution?',
        options: [
          'Account write-lock declarations',
          'The transaction size in bytes',
          'The presence of memo program instructions',
          'The sender\'s IP address'
        ],
        correct: 0
      },
      {
        id: 'r_h8',
        q: 'How does Raiku minimize state divergence during network-wide partitions?',
        options: [
          'By implementing local epoch-level rollback journals',
          'By freezing all validator hard drives',
          'By temporarily reverting to Ethereum consensus',
          'By dropping the block time to 5 seconds'
        ],
        correct: 0
      },
      {
        id: 'r_h9',
        q: 'What is the role of the rkuSOL token in the blockspace auction?',
        options: [
          'It serves as the collateral and primary bidding unit',
          'It acts as gas to pay Ethereum nodes',
          'It represents fractional ownership of server hardware',
          'It has no utility in auctions'
        ],
        correct: 0
      },
      {
        id: 'r_h10',
        q: 'What is Raiku\'s approach to cross-program invocation (CPI) optimization?',
        options: [
          'Pre-caching program accounts in the validator runtime memory',
          'Eliminating CPIs entirely from Solana smart contracts',
          'Compiling Rust to JavaScript during runtime',
          'Running CPIs inside sandboxed Python workers'
        ],
        correct: 0
      }
    ]
  },
  football: {
    easy: [
      {
        id: 'f_e1',
        q: 'Which nation has won the most FIFA World Cup titles?',
        options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
        correct: 2
      },
      {
        id: 'f_e2',
        q: 'What is the official nickname of the London club Arsenal?',
        options: ['The Gunners', 'The Red Devils', 'The Blues', 'The Citizens'],
        correct: 0
      },
      {
        id: 'f_e3',
        q: 'How many players from each team are on the pitch at the start of a match?',
        options: ['10', '11', '12', '9'],
        correct: 1
      },
      {
        id: 'f_e4',
        q: 'In which city is the famous stadium "Camp Nou" located?',
        options: ['Madrid', 'Lisbon', 'Barcelona', 'Milan'],
        correct: 2
      },
      {
        id: 'f_e5',
        q: 'Which soccer superstar is widely known as "CR7"?',
        options: ['Lionel Messi', 'Neymar Jr', 'Kylian Mbappé', 'Cristiano Ronaldo'],
        correct: 3
      },
      {
        id: 'f_e6',
        q: 'How long is a standard soccer match, excluding extra time?',
        options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
        correct: 1
      },
      {
        id: 'f_e7',
        q: 'What card does a referee show to a player to send them off the field?',
        options: ['Green Card', 'Blue Card', 'Yellow Card', 'Red Card'],
        correct: 3
      },
      {
        id: 'f_e8',
        q: 'Which country hosted the FIFA World Cup in 2014?',
        options: ['Brazil', 'South Africa', 'Germany', 'Japan'],
        correct: 0
      },
      {
        id: 'f_e9',
        q: 'Which team is famous for playing in a solid red kit at Anfield?',
        options: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea'],
        correct: 1
      },
      {
        id: 'f_e10',
        q: 'Who is the French superstar who joined Real Madrid in 2024?',
        options: ['Antoine Griezmann', 'Olivier Giroud', 'Kylian Mbappé', 'Paul Pogba'],
        correct: 2
      }
    ],
    intermediate: [
      {
        id: 'f_i1',
        q: 'Who is the all-time top scorer in the UEFA Champions League?',
        options: ['Lionel Messi', 'Cristiano Ronaldo', 'Robert Lewandowski', 'Karim Benzema'],
        correct: 1
      },
      {
        id: 'f_i2',
        q: 'Which club won the first-ever Premier League title in 1992/93?',
        options: ['Blackburn Rovers', 'Arsenal', 'Manchester United', 'Liverpool'],
        correct: 2
      },
      {
        id: 'f_i3',
        q: 'Which country hosted the 2022 FIFA World Cup?',
        options: ['Russia', 'Brazil', 'Qatar', 'South Africa'],
        correct: 2
      },
      {
        id: 'f_i4',
        q: 'Who won the Men\'s Ballon d\'Or award in 2023?',
        options: ['Erling Haaland', 'Kylian Mbappé', 'Lionel Messi', 'Rodri'],
        correct: 2
      },
      {
        id: 'f_i5',
        q: 'Which country won the UEFA Euro 2024 tournament?',
        options: ['England', 'France', 'Spain', 'Germany'],
        correct: 2
      },
      {
        id: 'f_i6',
        q: 'Which football player is famously known as "La Pulga" (The Flea)?',
        options: ['Alexis Sánchez', 'Lionel Messi', 'Neymar Jr.', 'Luis Suárez'],
        correct: 1
      },
      {
        id: 'f_i7',
        q: 'Which Italian club is famously nicknamed "The Old Lady"?',
        options: ['AC Milan', 'Inter Milan', 'Juventus', 'Roma'],
        correct: 2
      },
      {
        id: 'f_i8',
        q: 'Who was the manager of Arsenal during their legendary "Invincible" season?',
        options: ['Arsène Wenger', 'Alex Ferguson', 'Pep Guardiola', 'José Mourinho'],
        correct: 0
      },
      {
        id: 'f_i9',
        q: 'Which country won the FIFA Women\'s World Cup in 2023?',
        options: ['USA', 'England', 'Spain', 'Sweden'],
        correct: 2
      },
      {
        id: 'f_i10',
        q: 'What is the name of the German league system?',
        options: ['La Liga', 'Serie A', 'Ligue 1', 'Bundesliga'],
        correct: 3
      }
    ],
    hard: [
      {
        id: 'f_h1',
        q: 'Who was the first player to win three FIFA World Cup titles as a player?',
        options: ['Diego Maradona', 'Pelé', 'Zinedine Zidane', 'Ronaldo Nazário'],
        correct: 1
      },
      {
        id: 'f_h2',
        q: 'Which club has won the most UEFA Champions League titles in football history?',
        options: ['AC Milan', 'Bayern Munich', 'Real Madrid', 'Liverpool'],
        correct: 2
      },
      {
        id: 'f_h3',
        q: 'Who is the all-time top goalscorer in FIFA World Cup history?',
        options: ['Pelé', 'Ronaldo Nazário', 'Miroslav Klose', 'Gerd Müller'],
        correct: 2
      },
      {
        id: 'f_h4',
        q: 'In which year was the first ever FIFA World Cup held in Uruguay?',
        options: ['1924', '1930', '1934', '1950'],
        correct: 1
      },
      {
        id: 'f_h5',
        q: 'Which English football club holds the record for the longest unbeaten run in Premier League history?',
        options: ['Chelsea', 'Manchester United', 'Arsenal', 'Manchester City'],
        correct: 2
      },
      {
        id: 'f_h6',
        q: 'Who won the first-ever Ballon d\'Or award in 1956?',
        options: ['Stanley Matthews', 'Alfredo Di Stéfano', 'Raymond Kopa', 'Lev Yashin'],
        correct: 0
      },
      {
        id: 'f_h7',
        q: 'Which country has played in three FIFA World Cup finals but never won the trophy?',
        options: ['Sweden', 'Netherlands', 'Hungary', 'Croatia'],
        correct: 1
      },
      {
        id: 'f_h8',
        q: 'Which legendary player scored the famous "Hand of God" goal in 1986?',
        options: ['Diego Maradona', 'Pelé', 'Michel Platini', 'Zico'],
        correct: 0
      },
      {
        id: 'f_h9',
        q: 'What was the original name of the UEFA Champions League before 1992?',
        options: ['European Cup', 'UEFA Champions Cup', 'Intertoto Cup', 'Europa Cup'],
        correct: 0
      },
      {
        id: 'f_h10',
        q: 'Which club did legendary manager Sir Alex Ferguson manage before joining Manchester United?',
        options: ['Rangers', 'Aberdeen', 'Celtic', 'Hibernian'],
        correct: 1
      }
    ]
  },
  science: {
    easy: [
      {
        id: 's_e1',
        q: 'What is the closest planet to the Sun in our solar system?',
        options: ['Venus', 'Mercury', 'Mars', 'Earth'],
        correct: 1
      },
      {
        id: 's_e2',
        q: 'What is the chemical symbol for Water?',
        options: ['CO2', 'O2', 'H2O', 'H2'],
        correct: 2
      },
      {
        id: 's_e3',
        q: 'What gas do humans breathe in to survive?',
        options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Hydrogen'],
        correct: 1
      },
      {
        id: 's_e4',
        q: 'Which gas do plants primarily absorb during photosynthesis?',
        options: ['Oxygen', 'Argon', 'Carbon Dioxide', 'Helium'],
        correct: 2
      },
      {
        id: 's_e5',
        q: 'How many bones are in an adult human body?',
        options: ['106', '206', '306', '186'],
        correct: 1
      },
      {
        id: 's_e6',
        q: 'What is the boiling point of water in Celsius?',
        options: ['50°C', '90°C', '100°C', '120°C'],
        correct: 2
      },
      {
        id: 's_e7',
        q: 'What force pulls objects toward the center of the Earth?',
        options: ['Magnetism', 'Gravity', 'Centrifugal Force', 'Friction'],
        correct: 1
      },
      {
        id: 's_e8',
        q: 'What is the largest mammal on Earth?',
        options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Colossal Squid'],
        correct: 1
      },
      {
        id: 's_e9',
        q: 'Which organ in the human body is responsible for pumping blood?',
        options: ['Lungs', 'Brain', 'Liver', 'Heart'],
        correct: 3
      },
      {
        id: 's_e10',
        q: 'What instrument is used to measure temperature?',
        options: ['Barometer', 'Anemometer', 'Thermometer', 'Voltmeter'],
        correct: 2
      }
    ],
    intermediate: [
      {
        id: 's_i1',
        q: 'What is the approximate speed of light in a vacuum?',
        options: [
          '150,000 kilometers per second',
          '300,000 kilometers per second',
          '500,000 kilometers per second',
          '1,000,000 kilometers per second'
        ],
        correct: 1
      },
      {
        id: 's_i2',
        q: 'Which chemical element has the scientific symbol "Fe"?',
        options: ['Fluorine', 'Fermium', 'Lead', 'Iron'],
        correct: 3
      },
      {
        id: 's_i3',
        q: 'Who is credited with discovering penicillin in 1928?',
        options: ['Louis Pasteur', 'Marie Curie', 'Alexander Fleming', 'Gregor Mendel'],
        correct: 2
      },
      {
        id: 's_i4',
        q: 'What is the most abundant gas in Earth\'s atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
        correct: 1
      },
      {
        id: 's_i5',
        q: 'What unit is used to measure electrical resistance in physics?',
        options: ['Volt', 'Ampere', 'Watt', 'Ohm'],
        correct: 3
      },
      {
        id: 's_i6',
        q: 'Which blood cells are primarily responsible for fighting infections?',
        options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma cells'],
        correct: 1
      },
      {
        id: 's_i7',
        q: 'What is the formula for Einstein\'s mass-energy equivalence?',
        options: ['F = ma', 'PV = nRT', 'E = mc²', 'A = πr²'],
        correct: 2
      },
      {
        id: 's_i8',
        q: 'Which subatomic particle has a negative electric charge?',
        options: ['Proton', 'Neutron', 'Electron', 'Quark'],
        correct: 2
      },
      {
        id: 's_i9',
        q: 'What organelle is famously known as the powerhouse of the eukaryotic cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Lysosome'],
        correct: 2
      },
      {
        id: 's_i10',
        q: 'What is the pH value of pure water at room temperature?',
        options: ['5', '6', '7', '8'],
        correct: 2
      }
    ],
    hard: [
      {
        id: 's_h1',
        q: 'What is the absolute zero temperature in Kelvin?',
        options: ['-273 K', '0 K', '-100 K', '273 K'],
        correct: 1
      },
      {
        id: 's_h2',
        q: 'Which law of thermodynamics states that entropy of an isolated system always increases?',
        options: ['First Law', 'Second Law', 'Third Law', 'Zeroth Law'],
        correct: 1
      },
      {
        id: 's_h3',
        q: 'What is the primary element that makes up the fuel of the Sun?',
        options: ['Helium', 'Oxygen', 'Carbon', 'Hydrogen'],
        correct: 3
      },
      {
        id: 's_h4',
        q: 'What type of bond involves the sharing of electron pairs between atoms?',
        options: ['Ionic Bond', 'Metallic Bond', 'Hydrogen Bond', 'Covalent Bond'],
        correct: 3
      },
      {
        id: 's_h5',
        q: 'What is the escape velocity of Earth?',
        options: ['5.4 km/s', '8.2 km/s', '11.2 km/s', '15.6 km/s'],
        correct: 2
      },
      {
        id: 's_h6',
        q: 'Who proposed the mathematical constant denoted by \'h\' in quantum mechanics?',
        options: ['Albert Einstein', 'Max Planck', 'Niels Bohr', 'Werner Heisenberg'],
        correct: 1
      },
      {
        id: 's_h7',
        q: 'What is the rarest naturally occurring element in the Earth\'s crust?',
        options: ['Astatine', 'Francium', 'Promethium', 'Radium'],
        correct: 0
      },
      {
        id: 's_h8',
        q: 'Which fundamental force holds the atomic nucleus together?',
        options: ['Gravitational Force', 'Electromagnetic Force', 'Weak Nuclear Force', 'Strong Nuclear Force'],
        correct: 3
      },
      {
        id: 's_h9',
        q: 'What is the name of the first artificial satellite launched into orbit in 1957?',
        options: ['Sputnik 1', 'Explorer 1', 'Vanguard 1', 'Sputnik 2'],
        correct: 0
      },
      {
        id: 's_h10',
        q: 'What biological polymer is composed of nucleotides in a double-helix structure?',
        options: ['RNA', 'Protein', 'DNA', 'Polysaccharide'],
        correct: 2
      }
    ]
  },
  politics: {
    easy: [
      {
        id: 'p_e1',
        q: 'Where is the headquarters of the United Nations located?',
        options: ['Geneva, Switzerland', 'Brussels, Belgium', 'London, UK', 'New York City, USA'],
        correct: 3
      },
      {
        id: 'p_e2',
        q: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'Benjamin Franklin', 'George Washington', 'John Adams'],
        correct: 2
      },
      {
        id: 'p_e3',
        q: 'What is the capital city of France?',
        options: ['Lyon', 'Marseille', 'Paris', 'Bordeaux'],
        correct: 2
      },
      {
        id: 'p_e4',
        q: 'How many stars are on the flag of the United States?',
        options: ['48', '50', '52', '100'],
        correct: 1
      },
      {
        id: 'p_e5',
        q: 'What is the name of the UK national anthem?',
        options: ['God Save the King', 'Rule Britannia', 'Land of Hope and Glory', 'Jerusalem'],
        correct: 0
      },
      {
        id: 'p_e6',
        q: 'Which country is famous for its direct democracy and cantons?',
        options: ['Germany', 'Sweden', 'Switzerland', 'Austria'],
        correct: 2
      },
      {
        id: 'p_e7',
        q: 'What is the primary currency used in the European Union?',
        options: ['Pound Sterling', 'Euro', 'Swiss Franc', 'Krona'],
        correct: 1
      },
      {
        id: 'p_e8',
        q: 'How long is the term of a US President?',
        options: ['2 years', '4 years', '6 years', '8 years'],
        correct: 1
      },
      {
        id: 'p_e9',
        q: 'Which house of Congress in the US has 435 members?',
        options: ['Senate', 'House of Representatives', 'Supreme Court', 'Cabinet'],
        correct: 1
      },
      {
        id: 'p_e10',
        q: 'What is the official residence of the President of France?',
        options: ['Élysée Palace', 'Versailles Palace', 'Louvre Palace', 'Matignon Hotel'],
        correct: 0
      }
    ],
    intermediate: [
      {
        id: 'p_i1',
        q: 'Who was the first female Prime Minister of the United Kingdom?',
        options: ['Theresa May', 'Margaret Thatcher', 'Liz Truss', 'Angela Merkel'],
        correct: 1
      },
      {
        id: 'p_i2',
        q: 'What political philosophy advocates for a classless, stateless society?',
        options: ['Capitalism', 'Socialism', 'Communism', 'Feudalism'],
        correct: 2
      },
      {
        id: 'p_i3',
        q: 'How many members are there in the United States Senate?',
        options: ['435', '50', '100', '200'],
        correct: 2
      },
      {
        id: 'p_i4',
        q: 'Which country is governed under the system of a Federal Semi-Presidential Republic?',
        options: ['United States', 'Russia', 'United Kingdom', 'Canada'],
        correct: 1
      },
      {
        id: 'p_i5',
        q: 'What is the supreme co-decision law-making body of the European Union alongside the Council?',
        options: ['European Commission', 'European Parliament', 'European Central Bank', 'International Court of Justice'],
        correct: 1
      },
      {
        id: 'p_i6',
        q: 'In which year was the Magna Carta signed?',
        options: ['1066', '1215', '1492', '1776'],
        correct: 1
      },
      {
        id: 'p_i7',
        q: 'What is the official term limit duration for the President of France?',
        options: ['4 years', '5 years (max 2 terms)', '6 years', 'Life term'],
        correct: 1
      },
      {
        id: 'p_i8',
        q: 'Which historic document begins with the words "We the People"?',
        options: ['United States Constitution', 'Declaration of Independence', 'Gettysburg Address', 'Bill of Rights'],
        correct: 0
      },
      {
        id: 'p_i9',
        q: 'Who is officially the Head of State in Canada?',
        options: ['The Prime Minister', 'The Governor General', 'The Chief Justice', 'The British Monarch'],
        correct: 3
      },
      {
        id: 'p_i10',
        q: 'What year saw the fall of the Berlin Wall, symbolizing the end of the Cold War division?',
        options: ['1985', '1989', '1991', '1993'],
        correct: 1
      }
    ],
    hard: [
      {
        id: 'p_h1',
        q: 'Who was the principal author of the Declaration of Independence of the United States?',
        options: ['George Washington', 'Benjamin Franklin', 'Thomas Jefferson', 'John Adams'],
        correct: 2
      },
      {
        id: 'p_h2',
        q: 'Which treaty signed in 1948 established the basis for the modern concept of nation-state sovereignty?',
        options: ['Treaty of Versailles', 'Treaty of Westphalia', 'Treaty of Utrecht', 'Treaty of Ghent'],
        correct: 1
      },
      {
        id: 'p_h3',
        q: 'Who served as the first Chancellor of the German Empire in 1871?',
        options: ['Otto von Bismarck', 'Wilhelm I', 'Friedrich Ebert', 'Paul von Hindenburg'],
        correct: 0
      },
      {
        id: 'p_h4',
        q: 'What is the term of office for a judge on the International Court of Justice?',
        options: ['5 years', '9 years', '12 years', 'Life term'],
        correct: 1
      },
      {
        id: 'p_h5',
        q: 'Which philosopher wrote the influential political treatise "The Prince"?',
        options: ['Thomas Hobbes', 'John Locke', 'Jean-Jacques Rousseau', 'Niccolò Machiavelli'],
        correct: 3
      },
      {
        id: 'p_h6',
        q: 'What are the three branches of the United States federal government?',
        options: [
          'Federal, State, Local',
          'Legislative, Executive, Judicial',
          'Senate, House, Supreme Court',
          'President, Cabinet, Congress'
        ],
        correct: 1
      },
      {
        id: 'p_h7',
        q: 'Which international agreement signed in 1997 aimed to reduce greenhouse gas emissions?',
        options: ['Paris Agreement', 'Kyoto Protocol', 'Montreal Protocol', 'Geneva Convention'],
        correct: 1
      },
      {
        id: 'p_h8',
        q: 'Who was the first President of the Russian Federation after the collapse of the Soviet Union?',
        options: ['Mikhail Gorbachev', 'Boris Yeltsin', 'Vladimir Putin', 'Dmitry Medvedev'],
        correct: 1
      },
      {
        id: 'p_h9',
        q: 'In what year did women in the United Kingdom gain the right to vote on equal terms with men?',
        options: ['1918', '1920', '1928', '1945'],
        correct: 2
      },
      {
        id: 'p_h10',
        q: 'Which political thinker is famously known as the author of "Leviathan"?',
        options: ['John Locke', 'Thomas Hobbes', 'Karl Marx', 'Rousseau'],
        correct: 1
      }
    ]
  },
  current: {
    easy: [
      {
        id: 'c_e1',
        q: 'Which company makes the iPhone?',
        options: ['Google', 'Microsoft', 'Apple', 'Samsung'],
        correct: 2
      },
      {
        id: 'c_e2',
        q: 'What is the name of the popular AI chatbot developed by OpenAI?',
        options: ['Bard', 'Gemini', 'Claude', 'ChatGPT'],
        correct: 3
      },
      {
        id: 'c_e3',
        q: 'Which city hosted the Summer Olympic Games in 2024?',
        options: ['Los Angeles', 'Paris', 'Tokyo', 'Brisbane'],
        correct: 1
      },
      {
        id: 'c_e4',
        q: 'Which social media platform rebranded its logo to a minimal "X" in late 2023?',
        options: ['Twitter', 'Threads', 'BlueSky', 'Mastodon'],
        correct: 0
      },
      {
        id: 'c_e5',
        q: 'Who is the current CEO of Tesla and SpaceX?',
        options: ['Jeff Bezos', 'Bill Gates', 'Elon Musk', 'Mark Zuckerberg'],
        correct: 2
      },
      {
        id: 'c_e6',
        q: 'Which virtual currency has the largest market capitalization?',
        options: ['Ethereum', 'Solana', 'Ripple', 'Bitcoin'],
        correct: 3
      },
      {
        id: 'c_e7',
        q: 'What is the name of the UK Prime Minister who took office in July 2024?',
        options: ['Rishi Sunak', 'Keir Starmer', 'Boris Johnson', 'Theresa May'],
        correct: 1
      },
      {
        id: 'c_e8',
        q: 'Which tech giant developed the Android operating system?',
        options: ['Apple', 'Microsoft', 'Google', 'IBM'],
        correct: 2
      },
      {
        id: 'c_e9',
        q: 'What is the name of the viral short-video app owned by ByteDance?',
        options: ['Instagram', 'Snapchat', 'TikTok', 'YouTube'],
        correct: 2
      },
      {
        id: 'c_e10',
        q: 'Which country successfully landed its SLIM probe on the moon in early 2024?',
        options: ['India', 'China', 'Japan', 'USA'],
        correct: 2
      }
    ],
    intermediate: [
      {
        id: 'c_i1',
        q: 'Which tech company surpassed a $3 trillion market cap in 2024 driven by artificial intelligence chips?',
        options: ['Intel', 'NVIDIA', 'AMD', 'Qualcomm'],
        correct: 1
      },
      {
        id: 'c_i2',
        q: 'Which country officially joined NATO in March 2024 as its 32nd member?',
        options: ['Sweden', 'Finland', 'Ukraine', 'Switzerland'],
        correct: 0
      },
      {
        id: 'c_i3',
        q: 'What is the name of the NASA space telescope launched in late 2021 that sends deep-space infrared images?',
        options: ['Hubble Space Telescope', 'James Webb Space Telescope', 'Kepler Space Telescope', 'Spitzer Space Telescope'],
        correct: 1
      },
      {
        id: 'c_i4',
        q: 'Which country successfully landed its Chandrayaan-3 probe near the lunar south pole in 2023?',
        options: ['China', 'Japan', 'Russia', 'India'],
        correct: 3
      },
      {
        id: 'c_i5',
        q: 'What is the name of OpenAI\'s highly publicized text-to-video AI model announced in early 2024?',
        options: ['GPT-4o', 'Dall-E 3', 'Sora', 'Midjourney'],
        correct: 2
      },
      {
        id: 'c_i6',
        q: 'Who was elected as the President of Argentina in late 2023, known for his libertarian policies?',
        options: ['Alberto Fernández', 'Mauricio Macri', 'Luiz Inácio Lula da Silva', 'Javier Milei'],
        correct: 3
      },
      {
        id: 'c_i7',
        q: 'Which major bridge in Baltimore, USA collapsed in March 2024 after a container ship collision?',
        options: ['Golden Gate Bridge', 'Brooklyn Bridge', 'Francis Scott Key Bridge', 'Chesapeake Bay Bridge'],
        correct: 2
      },
      {
        id: 'c_i8',
        q: 'What is the primary cryptocurrency that underwent its 4th halving event in April 2024?',
        options: ['Bitcoin', 'Ethereum', 'Solana', 'Ripple'],
        correct: 0
      },
      {
        id: 'c_i9',
        q: 'Which company launched the vision-pro spatial computer in early 2024?',
        options: ['Sony', 'Google', 'Apple', 'Meta'],
        correct: 2
      },
      {
        id: 'c_i10',
        q: 'What is the name of Google\'s flagship multimodal AI model family introduced in late 2023?',
        options: ['PaLM', 'Gemini', 'BERT', 'Chinchilla'],
        correct: 1
      }
    ],
    hard: [
      {
        id: 'c_h1',
        q: 'What was the name of the private moon lander launched by Intuitive Machines that landed in February 2024?',
        options: ['Odysseus', 'Peregrine', 'Apollo 18', 'SLIM-2'],
        correct: 0
      },
      {
        id: 'c_h2',
        q: 'Which European country hosted the 2024 NATO summit in July to celebrate its 75th anniversary?',
        options: ['Belgium', 'Germany', 'Lithuania', 'United States'],
        correct: 3
      },
      {
        id: 'c_h3',
        q: 'In late 2023, which corporate battle led to Sam Altman being briefly ousted and then reinstated as CEO?',
        options: ['Meta shareholder vote', 'OpenAI board coup', 'Twitter acquisition lawsuit', 'Apple proxy fight'],
        correct: 1
      },
      {
        id: 'c_h4',
        q: 'Which nation officially announced its withdrawal from the OPEC cartel in late 2023?',
        options: ['Angola', 'Nigeria', 'Ecuador', 'Qatar'],
        correct: 0
      },
      {
        id: 'c_h5',
        q: 'What is the name of the open-source Large Language Model series released by Meta in 2024?',
        options: ['Llama 3', 'Claude 3', 'GPT-5', 'Grok 2'],
        correct: 0
      },
      {
        id: 'c_h6',
        q: 'What is the name of the revolutionary anti-obesity and diabetes drug manufactured by Novo Nordisk?',
        options: ['Humulin', 'Wegovy', 'Lipitor', 'Januvia'],
        correct: 1
      },
      {
        id: 'c_h7',
        q: 'Which country became the 20th nation to adopt the Euro currency on January 1, 2023?',
        options: ['Croatia', 'Bulgaria', 'Romania', 'Slovakia'],
        correct: 0
      },
      {
        id: 'c_h8',
        q: 'In 2023, which banking giant acquired its failing rival Credit Suisse in a government-backed rescue?',
        options: ['Deutsche Bank', 'HSBC', 'UBS', 'Barclays'],
        correct: 2
      },
      {
        id: 'c_h9',
        q: 'Which spacecraft was launched by ESA in 2023 to explore the icy moons of Jupiter?',
        options: ['JUICE', 'Europa Clipper', 'Galileo II', 'Juno Prime'],
        correct: 0
      },
      {
        id: 'c_h10',
        q: 'What is the name of the experimental fusion reactor in France that achieved a new heat duration record in 2024?',
        options: ['WEST', 'ITER', 'NIF', 'EAST'],
        correct: 0
      }
    ]
  }
};

export function getQuestionsForQuiz(category: string, difficulty: 'easy' | 'intermediate' | 'hard'): QuizQuestion[] {
  const categoryData = QUESTION_BANK[category];
  if (!categoryData) return [];
  const diffQuestions = categoryData[difficulty] || [];
  return diffQuestions.map((q) => ({ ...q, difficulty }));
}
