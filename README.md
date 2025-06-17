## How to prepare the file for the start?
1. Clone the repository: ``` git clone https://github.com/wrouruy/LivePort.git ```
2. go to the created directory: ``` cd LivePort ```
4. Set depences: ``` npm install ```
5. Make the script executable (UNIX systems only): ``` chmod +x liveport.js ```
6. Link the script globally: ``` npm link ```
  
## How to Use?
You can use code from any directory. Just enter ``` liveport ``` and the desired command in the terminal.<br>
For example, a command that changes the port for accessing the server: ``` liveport setport 3000 ```, below and familiarize yourself with the commands.<br>
**Please familiarize yourself with the list of commands (```liveport help```) and configurations (```liveport config```) before use!**
## Commands documentation:
| Name         |  Description                                                       | value   |
| ------------ | ------------------------------------------------------------------ | ------- |
| help         | opens the list of commands                                         | nothing |
| config       | opens the list of configurations                                   | nothing |
| setport      | changes the port to the specified one                              | number  |
| openserver   | starts the server, both on localhost and on IP                     | nothing |
| autoopensite | opens a browser with the page running when the server is turned on | boolean |

**Enjoy your use🌟!**
