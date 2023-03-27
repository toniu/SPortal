/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Group management', () => {
  let groupTemplate: any = {}

  /* Functions to test: validating input details of a group */
  function validateDetails(state: any): boolean {
    try {
      let success = true;

      /* Validate name */
      if (state.name.trim().length > 0 && state.name.trim().length < 3) {
        /* Error message: must be at least 3 characters */
        console.log('Invalid name: ', state.name, ' - not at least 3 characters')
        success = false
      }

      /* Validate description */
      if (state.description.trim().length > 0 && state.description.trim().length < 3) {
        /* Error message: must be at least 3 characters */
        console.log('Invalid descrption: ', state.description, ' - not at least 3 characters')
        success = false
      }

      /* Validate members */
      /* Check that there are no added members that are already 'owners' of the group */
      const ownerEmails = state.originalState.owners
      const includesOwners = state.members.filter((m: any) => ownerEmails.indexOf(m) >= 0)
      if (includesOwners.length > 0) {
        /* Error message: cannot add members that are already owners of group */
        console.log('Invalid members: ', includesOwners, ' are already owners of the group, cannot be member of group')
        success = false
      }
      return success;
    } catch (e) {
      console.log(e);
    }
  }

  beforeEach(() => {
    groupTemplate = {
      name: 'name',
      description: 'description',
      members: [],
      originalState: {
        members: [],
        owners: []
      }
    }
  });

  it('Checking members to add after saved changes, adding a user', () => {
    /* Before and after member list of changes */
    const groupToTest = groupTemplate
    groupToTest.originalState.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk']
    groupToTest.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk', 'zhac033@live.rhul.ac.uk']

    const membersBefore = groupToTest.originalState.members
    const membersAfter = groupToTest.members

    /* The members to add and/or remove from the group based on saved changes */
    const membersToAdd = membersAfter.filter((m: string) => membersBefore.indexOf(m) < 0)
    const membersToRemove = membersBefore.filter((m: string) => membersAfter.indexOf(m) < 0)

    expect(membersToAdd.length).toBe(1)
    expect(membersToRemove.length).toBe(0)
  });

  it('Checking members to add after saved changes, removing a user', () => {
    /* Before and after member list of changes */
    const groupToTest = groupTemplate
    groupToTest.originalState.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk', 'zhac033@live.rhul.ac.uk']
    groupToTest.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk']

    const membersBefore = groupToTest.originalState.members
    const membersAfter = groupToTest.members

    /* The members to add and/or remove from the group based on saved changes */
    const membersToAdd = membersAfter.filter((m: string) => membersBefore.indexOf(m) < 0)
    const membersToRemove = membersBefore.filter((m: string) => membersAfter.indexOf(m) < 0)

    expect(membersToAdd.length).toBe(0)
    expect(membersToRemove.length).toBe(1)
  });

  it('Checking members to add after saved changes, no changes', () => {
    /* Before and after member list of changes */
    const groupToTest = groupTemplate
    groupToTest.originalState.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk']
    groupToTest.members = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk']

    const membersBefore = groupToTest.originalState.members
    const membersAfter = groupToTest.members

    /* The members to add and/or remove from the group based on saved changes */
    const membersToAdd = membersAfter.filter((m: string) => membersBefore.indexOf(m) < 0)
    const membersToRemove = membersBefore.filter((m: string) => membersAfter.indexOf(m) < 0)

    expect(membersToAdd.length).toBe(0)
    expect(membersToRemove.length).toBe(0)
  });

  it('Checking members to add after saved changes, adding and removing members', () => {
    /* Before and after member list of changes */
    const membersBefore = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk', 'zhac033@live.rhul.ac.uk', 'zhac034@live.rhul.ac.uk']
    const membersAfter = ['zhac031@live.rhul.ac.uk', 'zhac032@live.rhul.ac.uk', 'zhac035@live.rhul.ac.uk', 'zhac036@live.rhul.ac.uk']

    /* The members to add and/or remove from the group based on saved changes */
    const membersToAdd = membersAfter.filter((m: string) => membersBefore.indexOf(m) < 0)
    const membersToRemove = membersBefore.filter((m: string) => membersAfter.indexOf(m) < 0)

    expect(membersToAdd.length).toBe(2)
    expect(membersToRemove.length).toBe(2)
  });

  it('Validating details - validating name', () => {
    /* Group details */
    const groupToTest = groupTemplate

    /* Valid tests: must be at least 3 characters */
    groupToTest.name = 'TN001'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.name = 'TN001021x'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.name = 'TN00113'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.name = 'TNe'
    expect(validateDetails(groupToTest)).toBe(true)
    /* Note: in the actual implementation, 
   a blank input would use the placeholder/original name so this is technically valid 
   e.g. original value: 'GroupName' and the input '' means input -> 'GroupName' */
    groupToTest.name = ''
    expect(validateDetails(groupToTest)).toBe(true)

    /* Invalid tests */
    groupToTest.name = 'T'
    expect(validateDetails(groupToTest)).toBe(false)
    groupToTest.name = 'TN'
    expect(validateDetails(groupToTest)).toBe(false)
    groupToTest.name = '0'
    expect(validateDetails(groupToTest)).toBe(false)
  });

  it('Validating details - validating description', () => {
    /* Group details */
    const groupToTest = groupTemplate

    /* Valid tests */
    groupToTest.description = 'This is a group description'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.description = 'This is a group'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.description = 'This is'
    expect(validateDetails(groupToTest)).toBe(true)
    groupToTest.description = 'Thi'
    expect(validateDetails(groupToTest)).toBe(true)
    /* Note: in the actual implementation, 
    a blank input would use the placeholder/original name so this is technically valid 
    e.g. original value: 'GroupDescription' and the input '' means input -> 'GroupDescription' */
    groupToTest.description = ''
    expect(validateDetails(groupToTest)).toBe(true)

    /* Invalid tests */
    groupToTest.description = 'T'
    expect(validateDetails(groupToTest)).toBe(false)
    groupToTest.description = 'Th'
    expect(validateDetails(groupToTest)).toBe(false)
    groupToTest.description = '0'
    expect(validateDetails(groupToTest)).toBe(false)
  });

  it('Validating details - validating owners', () => {
    /* Group details */
    const groupToTest = groupTemplate

    /* Valid tests */
    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk']
    groupToTest.members = ['zhac002@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(true)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk']
    groupToTest.members = []
    expect(validateDetails(groupToTest)).toBe(true)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk']
    groupToTest.members = ['zhac003@live.rhul.ac.uk', 'zhac004@live.rhul.ac.uk', 'zhac005@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(true)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk']
    groupToTest.members = []
    expect(validateDetails(groupToTest)).toBe(true)


    /* Invalid tests */
    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk']
    groupToTest.members = ['zhac001@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(false)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk']
    groupToTest.members = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(false)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk']
    groupToTest.members = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk', 'zhac003@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(false)

    groupToTest.originalState.owners = ['zhac001@live.rhul.ac.uk', 'zhac002@live.rhul.ac.uk']
    groupToTest.members = ['zhac002@live.rhul.ac.uk', 'zhac003@live.rhul.ac.uk', 'zhac005@live.rhul.ac.uk']
    expect(validateDetails(groupToTest)).toBe(false)
  });
});
