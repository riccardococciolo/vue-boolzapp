const dt = luxon.DateTime;

const { createApp } = Vue;

createApp ({
    data() {
        return {
            contacts: [
                {
                    name: 'Michele',
                    avatar: '_1',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Hai portato a spasso il cane?',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'Ricordati di stendere i panni',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '16:15',
                            message: 'Tutto fatto!',
                            status: 'received',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Fabio',
                    avatar: '_2',
                    visible: true,
                    messages: [
                        {
                            date: '16:30',
                            message: 'Ciao come stai?',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '16:30',
                            message: 'Bene grazie! Stasera ci vediamo?',
                            status: 'received',
                            menu: false,
                        },
                        {
                            date: '16:35',
                            message: 'Mi piacerebbe ma devo andare a fare la spesa.',
                            status: 'sent',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Samuele',
                    avatar: '_3',
                    visible: true,
                    messages: [
                        {
                            date: '10:10',
                            message: 'La Marianna va in campagna',
                            status: 'received',
                            menu: false,
                        },
                        {
                            date: '10:20',
                            message: 'Sicuro di non aver sbagliato chat?',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '16:15',
                            message: 'Ah scusa!',
                            status: 'received',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Alessandro B.',
                    avatar: '_4',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Lo sai che ha aperto una nuova pizzeria?',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'Si, ma preferirei andare al cinema',
                            status: 'received',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Alessandro L.',
                    avatar: '_5',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Ricordati di chiamare la nonna',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'Va bene, stasera la sento',
                            status: 'received',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Claudia',
                    avatar: '_6',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Ciao Claudia, hai novità?',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'Non ancora',
                            status: 'received',
                            menu: false,
                        },
                        {
                            date: '15:51',
                            message: 'Nessuna nuova, buona nuova',
                            status: 'sent',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Federico',
                    avatar: '_7',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Fai gli auguri a Martina che è il suo compleanno!',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'Grazie per avermelo ricordato, le scrivo subito!',
                            status: 'received',
                            menu: false,
                        }
                    ],
                },
                {
                    name: 'Davide',
                    avatar: '_8',
                    visible: true,
                    messages: [
                        {
                            date: '15:30',
                            message: 'Ciao, andiamo a mangiare la pizza stasera?',
                            status: 'received',
                            menu: false,
                        },
                        {
                            date: '15:50',
                            message: 'No, l\'ho già mangiata ieri, ordiniamo sushi!',
                            status: 'sent',
                            menu: false,
                        },
                        {
                            date: '15:51',
                            message: 'OK!!',
                            status: 'received',
                            menu: false,
                        }
                    ],
                }
            ],
            curIndex: 0,
            newMess: '',
            searchText: '',
            answer: '',
        }
    },
    created() {
       
    }, 
    methods: {
        sendRequest: async function() {
            try {
                const answer = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'text-davinci-003',
                    messages: [{ role: 'user', content: this.newMess }],
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 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',
                    },
                });

                this.answer = answer.data.choices[0].message.content;
            } catch (error) {
                console.error('Errore nella richiesta a ChatGPT:', error);
            }
        },
        openChat (index) {
            this.curIndex = index
        },
        sendMessage() {
            const now = dt.now();

            if (this.newMess.trim() !== '') { // Assicurati che il messaggio non sia vuoto
              this.contacts[this.curIndex].messages.push({
                date: now.toFormat("HH:mm"),
                message: this.newMess,
                status: 'sent',
                menu: false,
              });
      
              this.newMess = '';
              
              setTimeout(() => {
                this.contacts[this.curIndex].messages.push({
                    date: now.toFormat("HH:mm"),
                    message: this.answer,
                    status: 'received',
                    menu: false,
                  });
              }, 1000);// Azzera l'input del nuovo messaggio
            }
            this.sendRequest();
        },
        searchContact() {
            this.contacts.forEach(contact => {
                const contactName = contact.name.toLowerCase();
                contact.visible = contactName.includes(this.searchText.trim());
            })
        },
        dropMenu(index) {
            this.contacts[this.curIndex].messages[index].menu = ! this.contacts[this.curIndex].messages[index].menu
        },
        remove(index) {
            this.contacts[this.curIndex].messages.splice(index, 1);
        },
    }
}).mount("#app");