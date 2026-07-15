-- Storage bucket policies
-- Run this in Supabase SQL Editor

-- Allow public read access to all storage objects
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to update
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (auth.uid() IS NOT NULL);
