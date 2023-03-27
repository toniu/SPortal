/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Profile', () => {

    /* Functions to test: */
    const getUsersToDiscover = (email: string): any => {
      /* Initialise array */
      const usersToDiscover = []

      /* Extract ZHAC code */
      const zhacCodeString = email.replace('i:0#.f|membership|', '')
      const matches = zhacCodeString.match('[0-9]+').toString()
      const zhacNumber = parseInt(matches)
  
      /* Random shuffle of potential user profile codes */
      let userCodeRange = [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5]
      function shuffleArray(array: any): any {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array
      }
  
      /* Padding zeros to three - e.g. 5 to 005 */
      function pad(n: number, length: number): string {
        let len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
      }
  
      /* Shuffle the range of profiles and extract the number to use as email parameter
      i.e. Current user zhac020@live.rhul.ac.uk -> Random user code {20 + 2} -> 021
      -> Find user properties of user 'zhac022@live.rhul.ac.uk' */
  
      userCodeRange = shuffleArray(userCodeRange)
      const zhacCodeRanges = userCodeRange.map(c => pad((c + zhacNumber), 3))
  
      /* Variables for iterator */
      let i = 0
  
      /* Some ZHAC-XXX codes might be out of range or invalid so check through the range at least */
      while (usersToDiscover.length < 3 && i < zhacCodeRanges.length) {
        /* Three users to discover finally found */
        usersToDiscover.push(`i:0#.f|membership|zhac${zhacCodeRanges[i]}@live.rhul.ac.uk`)
        /* Increment */
        i++;
      }
      
      console.log('Profile currently on: ', email)
      console.log('Suggested users to discover: ', usersToDiscover)
      return usersToDiscover
    }

    it('Users to discover', () => {
      /* Theoretically if there was a user with email from zhac001 onwards (some emails are missing),
      The function should work if we get suggested three new users */
      
      const originalUser = `i:0#.f|membership|zhac030@live.rhul.ac.uk`
      const suggestedUsers = getUsersToDiscover(originalUser)
      expect(suggestedUsers.length).toBe(3)

      /* Simulate if the user wants to then discover another user */
      const i = Math.floor(Math.random() * 2) + 1
      const clickedSuggestedUser = suggestedUsers[i]
      const nextSuggestedUsers = getUsersToDiscover(clickedSuggestedUser)
      expect(nextSuggestedUsers.length).toBe(3)
    });
  });
  