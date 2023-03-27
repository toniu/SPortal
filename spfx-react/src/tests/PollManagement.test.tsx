/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The unit tests for the key functions in the components of the Poll management web part
 */
describe('Poll management', () => {
  let pollsTemplate: any = {}

  /* Functions to test: */
  const includesPoll = (p: any, polls: any[]): boolean => {
    for (let i = 0; i < polls.length; i++) {
      if (polls[i].uniqueId === p.uniqueId) {
        return true;
      }
    }
    return false
  }

  const shouldChange = (pollsBefore: any, pollsAfter: any): boolean => {
    let savedChanges = false;

    const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
    const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

    const epBefore = pollsBefore.filter((p: any) => !includesPoll(p, pollsToDelete))
    const epAfter = pollsAfter.filter((p: any) => !includesPoll(p, pollsToCreate))

    for (let i = 0; i < epAfter.length; i++) {

     /* Check for property change in start date */
     if (new Date(epAfter[i].StartDate).getTime() !== new Date(epBefore[i].StartDate).getTime()) {
      savedChanges = true
      console.log('StartDate Changed for item ', i, ': ', epBefore[i].StartDate, ' to ', epAfter[i].StartDate)
    }

    /* Check for property change in end date */
    if (new Date(epAfter[i].EndDate).getTime() !== new Date(epBefore[i].EndDate).getTime()) {
      savedChanges = true
      console.log('EndDate changed for item', i, ': ', epBefore[i].EndDate, ' to ', epAfter[i].EndDate)
    }

    /* Check for property change in visibility */
    if (epAfter[i].Visibility !== epBefore[i].Visibility) {
      savedChanges = true
      console.log('Visibility changed for item', i)
    }

    }
    
    return savedChanges;
  }

  interface questionTemplate {
    uniqueId: string
    StartDate: string
    EndDate: string
    Visibility: string
  }

  beforeEach(() => {
    pollsTemplate = {
      previousPolls: [],
      currentPolls: [],
      pollResponse: ''
    }
  });

  it('Checking polls to add after saved changes, No polls added', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate
    const P1: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P2: questionTemplate = {
      uniqueId: 'P-002',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P3: questionTemplate = {
      uniqueId: 'P-003',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    /* */

    pollsToTest.previousPolls.push(P1)
    pollsToTest.previousPolls.push(P2)
    pollsToTest.previousPolls.push(P3)

    pollsToTest.currentPolls = pollsToTest.previousPolls

    /* Get the before and after state of the polls after saved changes */
    const pollsBefore = pollsToTest.previousPolls;
    const pollsAfter = pollsToTest.currentPolls;

    /* Based on saved changes, is there any polls to add or remove */
    const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
    const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

    expect(pollsToCreate.length).toBe(0)
    expect(pollsToDelete.length).toBe(0)

  });

  it('Checking polls to add after saved changes, adding new polls', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate
    const P1: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P2: questionTemplate = {
      uniqueId: 'P-002',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P3: questionTemplate = {
      uniqueId: 'P-003',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    /* New poll */
    const P4: questionTemplate = {
      uniqueId: 'P-004',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };

    /* Scenario: Poll P4 is added! */
    pollsToTest.previousPolls.push(P1)
    pollsToTest.previousPolls.push(P2)
    pollsToTest.previousPolls.push(P3)

    pollsToTest.currentPolls.push(P1)
    pollsToTest.currentPolls.push(P2)
    pollsToTest.currentPolls.push(P3)
    pollsToTest.currentPolls.push(P4)

    /* Get the before and after state of the polls after saved changes */
    const pollsBefore = pollsToTest.previousPolls;
    const pollsAfter = pollsToTest.currentPolls;

    /* Based on saved changes, is there any polls to add or remove */
    const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
    const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

    expect(pollsToCreate.length).toBe(1)
    expect(pollsToDelete.length).toBe(0)

  });

  it('Checking polls to add after saved changes, removing polls', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate
    const P1: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P2: questionTemplate = {
      uniqueId: 'P-002',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P3: questionTemplate = {
      uniqueId: 'P-003',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    /* */

    /* Scenario: Poll P3 is deleted! */
    pollsToTest.previousPolls.push(P1)
    pollsToTest.previousPolls.push(P2)
    pollsToTest.previousPolls.push(P3)

    pollsToTest.currentPolls.push(P1)
    pollsToTest.currentPolls.push(P2)

    /* Get the before and after state of the polls after saved changes */
    const pollsBefore = pollsToTest.previousPolls;
    const pollsAfter = pollsToTest.currentPolls;

    /* Based on saved changes, is there any polls to add or remove */
    const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
    const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

    expect(pollsToCreate.length).toBe(0)
    expect(pollsToDelete.length).toBe(1)

  });

  it('Checking polls to add after saved changes, adding and removing polls', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate
    const P1: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P2: questionTemplate = {
      uniqueId: 'P-002',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    const P3: questionTemplate = {
      uniqueId: 'P-003',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };
    /* New poll */
    const P4: questionTemplate = {
      uniqueId: 'P-004',
      StartDate: '???',
      EndDate: '???',
      Visibility: 'Public'
    };

     /* Scenario: Poll P3 is deleted! Poll P4 added */
     pollsToTest.previousPolls.push(P1)
     pollsToTest.previousPolls.push(P2)
     pollsToTest.previousPolls.push(P3)
 
     pollsToTest.currentPolls.push(P1)
     pollsToTest.currentPolls.push(P2)
     pollsToTest.currentPolls.push(P4)

    /* Get the before and after state of the polls after saved changes */
    const pollsBefore = pollsToTest.previousPolls;
    const pollsAfter = pollsToTest.currentPolls;

    /* Based on saved changes, is there any polls to add or remove */
    const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
    const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

    expect(pollsToCreate.length).toBe(1)
    expect(pollsToDelete.length).toBe(1)
  });

  it('Poll management: no saved changes to the details', () => {
     /* Polls set-up */
     const pollsToTest = pollsTemplate

     /* Polls before */
     const previousP: questionTemplate = {
       uniqueId: 'P-001',
       StartDate: '01/01/2023',
       EndDate: '01/01/2023',
       Visibility: 'Public'
     };

     /* Polls after: no changes */
     const currentP: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '01/01/2023',
      EndDate: '01/01/2023',
      Visibility: 'Public'
    };
     
     pollsToTest.previousPolls.push(previousP)
     pollsToTest.currentPolls.push(currentP)

     expect(shouldChange(pollsToTest.previousPolls, pollsToTest.currentPolls)).toBe(false)
  });

  it('Poll management: saved changes to start date', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate

    /* Polls before */
    const previousP: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '01/01/2023',
      EndDate: '01/01/2023',
      Visibility: 'Public'
    };

    /* Polls after: change to start date */
    const currentP: questionTemplate = {
     uniqueId: 'P-001',
     StartDate: '01/03/2023',
     EndDate: '01/01/2023',
     Visibility: 'Public'
   };
    
    pollsToTest.previousPolls.push(previousP)
    pollsToTest.currentPolls.push(currentP)

    expect(shouldChange(pollsToTest.previousPolls, pollsToTest.currentPolls)).toBe(true)
  });

  it('Poll management: saved changes to end date', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate

    /* Polls before */
    const previousP: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '01/01/2023',
      EndDate: '01/01/2023',
      Visibility: 'Public'
    };

    /* Polls after: change to end date */
    const currentP: questionTemplate = {
     uniqueId: 'P-001',
     StartDate: '01/01/2023',
     EndDate: '01/03/2023',
     Visibility: 'Public'
   };
    
    pollsToTest.previousPolls.push(previousP)
    pollsToTest.currentPolls.push(currentP)

    expect(shouldChange(pollsToTest.previousPolls, pollsToTest.currentPolls)).toBe(true)
  });

  it('Poll management: saved changes to visibility', () => {
    /* Polls set-up */
    const pollsToTest = pollsTemplate

    /* Polls before */
    const previousP: questionTemplate = {
      uniqueId: 'P-001',
      StartDate: '01/01/2023',
      EndDate: '01/01/2023',
      Visibility: 'Public'
    };

    /* Polls after: no changes */
    const currentP: questionTemplate = {
     uniqueId: 'P-001',
     StartDate: '01/01/2023',
     EndDate: '01/01/2023',
     Visibility: 'Private'
   };
    
    pollsToTest.previousPolls.push(previousP)
    pollsToTest.currentPolls.push(currentP)

    expect(shouldChange(pollsToTest.previousPolls, pollsToTest.currentPolls)).toBe(true)
  });
});
