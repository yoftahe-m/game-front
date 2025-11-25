router.get('/signin', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.substring(7);
    const verifiedToken = await clerkClient.verifyToken(token);
    const clerkUserId = verifiedToken.sub;

    // Fetch user info from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
    const first_name = clerkUser.firstName || null;
    const last_name = clerkUser.lastName || null;

    // Find or create user in your database
    let userId = '';

    const [existingUser] = await db.select().from(users).where(eq(users.clerk_user_id, clerkUserId)).limit(1);

    if (!existingUser) {
      userId = nanoid();

      await db
        .insert(users)
        .values({
          id: userId,
          clerk_user_id: clerkUserId,
          active: true,
          email,
          first_name,
          last_name,
        })
        .returning();
    } else {
      userId = existingUser.id;
    }

    const memberships = await db
      .select({
        organization_id: organizationMembers.organizationId,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.user_id, userId));

    const activeOrganizationId = memberships[0]?.organizationId || null;

    res.json({
      user: {
        id: userId,
        email,
        firstName,
        lastName,
      },
      activeOrganizationId,
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});
