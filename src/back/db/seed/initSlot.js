const db = require('../index')
const SlotService = require('../../app/services/SlotService')

const run = async () => {
  const slotService = new SlotService(db)
  const slots = await slotService.selectSlots()
  if (!slots.length) {
    await slotService.createSlot({
      id: null,
      data: {
        'name': 'StarterSlot',
        'number_of_columns': 3,
        'number_of_rows': 3,
        'symbols': [
          {
            'value': 'A',
            'image': 'A'
          },
          {
            'value': 'B',
            'image': 'B'
          },
          {
            'value': 'C',
            'image': 'C'
          }
        ],
        'start_view': [
          [
            {
              'value': 'B'
            },
            {
              'value': 'C'
            },
            {
              'value': 'B'
            }
          ],
          [
            {
              'value': 'B'
            },
            {
              'value': 'A'
            },
            {
              'value': 'B'
            }
          ],
          [
            {
              'value': 'B'
            },
            {
              'value': 'C'
            },
            {
              'value': 'A'
            }
          ]
        ],
        'reels': [
          [
            {
              'value': 'A'
            },
            {
              'value': 'B'
            },
            {
              'value': 'C'
            }
          ],
          [
            {
              'value': 'A'
            },
            {
              'value': 'B'
            },
            {
              'value': 'C'
            }
          ],
          [
            {
              'value': 'A'
            },
            {
              'value': 'B'
            },
            {
              'value': 'C'
            }
          ]
        ],
        'lines': [
          [
            {
              'value': 1
            },
            {
              'value': 1
            },
            {
              'value': 1
            }
          ]
        ],
        'paytable': [
          [
            {
              'symbol': {
                'value': 'A',
                'image': 'A'
              },
              'symbolsCount': 0,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'B',
                'image': 'B'
              },
              'symbolsCount': 0,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'C',
                'image': 'C'
              },
              'symbolsCount': 0,
              'cost': 0
            }
          ],
          [
            {
              'symbol': {
                'value': 'A',
                'image': 'A'
              },
              'symbolsCount': 1,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'B',
                'image': 'B'
              },
              'symbolsCount': 1,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'C',
                'image': 'C'
              },
              'symbolsCount': 1,
              'cost': 0
            }
          ],
          [
            {
              'symbol': {
                'value': 'A',
                'image': 'A'
              },
              'symbolsCount': 2,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'B',
                'image': 'B'
              },
              'symbolsCount': 2,
              'cost': 0
            },
            {
              'symbol': {
                'value': 'C',
                'image': 'C'
              },
              'symbolsCount': 2,
              'cost': 0
            }
          ],
          [
            {
              'symbol': {
                'value': 'A',
                'image': 'A'
              },
              'symbolsCount': 3,
              'cost': 1
            },
            {
              'symbol': {
                'value': 'B',
                'image': 'B'
              },
              'symbolsCount': 3,
              'cost': 2
            },
            {
              'symbol': {
                'value': 'C',
                'image': 'C'
              },
              'symbolsCount': 3,
              'cost': 3
            }
          ]
        ],
        'bids': [1,2.5]
      }
    })
  }
}

run()

